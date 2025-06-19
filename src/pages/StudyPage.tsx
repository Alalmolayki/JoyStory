import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { generateExplanatoryFlashcards } from '../lib/openai';
import { FlashcardFlip } from '../components/FlashcardFlip';
import { CongratulationsModal } from '../components/CongratulationsModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { FlashcardSet, Flashcard as FlashcardType } from '../types';
import toast from 'react-hot-toast';

export function StudyPage() {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewCards, setReviewCards] = useState<FlashcardType[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingExplanations, setIsGeneratingExplanations] = useState(false);
  const [startTime] = useState(new Date());

  useEffect(() => {
    if (setId && user) {
      fetchFlashcardSet();
    } else if (setId && !user) {
      // Eğer setId var ama kullanıcı yoksa, kullanıcı mevcut olana kadar yüklemeye devam et
      setLoading(true);
    }
  }, [setId, user]);

  const fetchFlashcardSet = async () => {
    if (!user || !setId) return;

    setLoading(true);
    setError(null);

    try {
      // Flashcard setini getir
      const { data: setData, error: setError } = await supabase
        .from('flashcard_sets')
        .select('*')
        .eq('id', setId)
        .eq('user_id', user.id)
        .single();

      if (setError) {
        if (setError.code === 'PGRST116') {
          throw new Error('Flashcard seti bulunamadı veya erişim izniniz yok');
        }
        throw setError;
      }
      
      setFlashcardSet(setData);

      // Flashcard'ları getir
      const { data: cardsData, error: cardsError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('flashcard_set_id', setId)
        .order('order_index');

      if (cardsError) throw cardsError;
      
      const cards = cardsData || [];
      setFlashcards(cards);
      
      // Eğer kart yoksa, bu bir hata durumudur
      if (cards.length === 0) {
        throw new Error('Bu sette flashcard bulunamadı');
      }
    } catch (error) {
      console.error('Error fetching flashcard set:', error);
      const errorMessage = error instanceof Error ? error.message : 'Flashcard seti yüklenemedi';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUnderstand = async () => {
    const currentCard = flashcards[currentCardIndex];
    
    try {
      // Kartı anlaşıldı olarak güncelle
      await supabase
        .from('flashcards')
        .update({ understood: true, needs_review: false })
        .eq('id', currentCard.id);

      toast.success('Harika! Sonraki karta geçiliyor');

      // Sonraki karta geç
      if (currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        // Açıklayıcı kartlar oluşturmamız gerekip gerekmediğini kontrol et
        if (reviewCards.length > 0) {
          await generateExplanatoryCards();
        } else {
          completeSession();
        }
      }
    } catch (error) {
      console.error('Error updating card:', error);
      toast.error('İlerleme güncellenemedi');
    }
  };

  const handleDontUnderstand = async () => {
    const currentCard = flashcards[currentCardIndex];
    
    try {
      // Kartı gözden geçirilmesi gerekiyor olarak güncelle
      await supabase
        .from('flashcards')
        .update({ understood: false, needs_review: true })
        .eq('id', currentCard.id);

      // Zaten yoksa gözden geçirme kartlarına ekle
      if (!reviewCards.find(card => card.id === currentCard.id)) {
        setReviewCards([...reviewCards, currentCard]);
        toast('Gözden geçirme listesine eklendi', { icon: '📝' });
      }

      

      // Sonraki karta geç
      if (currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        // Gözden geçirme kartları için açıklayıcı kartlar oluştur
        await generateExplanatoryCards();
      }
    } catch (error) {
      console.error('Error updating card:', error);
      toast.error('İlerleme güncellenemedi');
    }
  };

  const generateExplanatoryCards = async () => {
    if (!flashcardSet || reviewCards.length === 0) {
      completeSession();
      return;
    }

    setIsGeneratingExplanations(true);
    toast.loading('Kişiselleştirilmiş açıklamalar oluşturuluyor...', { id: 'generating' });

    try {
      const difficultCardContents = reviewCards.map(card => card.content);
      const explanatoryContents = await generateExplanatoryFlashcards(
        flashcardSet.grade,
        flashcardSet.subject,
        flashcardSet.topic,
        difficultCardContents
      );

      // Açıklayıcı kartları ekle
      const explanatoryCardsToInsert = explanatoryContents.map((content, index) => ({
        flashcard_set_id: flashcardSet.id,
        content: content.content,
        explanation: content.explanation,
        order_index: flashcards.length + index,
        understood: false,
        needs_review: false,
        is_explanatory: true,
      }));

      const { data: newCards, error } = await supabase
        .from('flashcards')
        .insert(explanatoryCardsToInsert)
        .select();

      if (error) throw error;

      // Yeni kartları mevcut flashcard'lara ekle ve sıfırla
      setFlashcards([...flashcards, ...(newCards || [])]);
      setCurrentCardIndex(flashcards.length);
      setReviewCards([]);
      
      toast.success('Açıklamalar oluşturuldu! Hadi bunları gözden geçirelim.', { id: 'generating' });
    } catch (error) {
      console.error('Error generating explanatory cards:', error);
      toast.error('Açıklamalar oluşturulamadı', { id: 'generating' });
      completeSession();
    } finally {
      setIsGeneratingExplanations(false);
    }
  };

  const completeSession = async () => {
    if (!flashcardSet) return;

    try {
      // Flashcard setini tamamlandı olarak işaretle
      await supabase
        .from('flashcard_sets')
        .update({ completed: true, updated_at: new Date().toISOString() })
        .eq('id', flashcardSet.id);

      setIsComplete(true);
      toast.success('🎉 Çalışma seansı tamamlandı!');
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Tamamlanma durumu kaydedilemedi');
      setIsComplete(true); // Yine de tamamlanma modalını göster
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setReviewCards([]);
    setIsComplete(false);
    toast('Çalışma seansı yeniden başlatılıyor', { icon: '🔄' });
  };

  const handleRetry = () => {
    if (setId && user) {
      fetchFlashcardSet();
    }
  };

  const calculateStudyTime = () => {
    const endTime = new Date();
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMins = Math.round(diffMs / 60000);
    return diffMins > 0 ? `${diffMins} dakika` : '1 dakikadan az';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400 mt-4">Çalışma seansınız yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Çalışma Seansı Yüklenemedi</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Tekrar Dene
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Kontrol Paneline Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!flashcardSet || flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Flashcard bulunamadı</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Kontrol Paneline Dön
          </button>
        </div>
      </div>
    );
  }

  if (isGeneratingExplanations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Açıklamalar Oluşturuluyor</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Zor kavramlar için kişiselleştirilmiş açıklamalar oluşturuluyor...</p>
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kontrol Paneline Dön
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{flashcardSet.subject}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{flashcardSet.topic} • {flashcardSet.grade}. Sınıf</p>
          </div>
          
          <div className="w-32"></div> {/* Ortalama için boşluk */}
        </div>

        {/* Flashcard Bileşeni */}
        {currentCardIndex < flashcards.length && (
          <FlashcardFlip
            flashcard={flashcards[currentCardIndex]}
            onUnderstand={handleUnderstand}
            onDontUnderstand={handleDontUnderstand}
            currentIndex={currentCardIndex}
            totalCards={flashcards.length}
          />
        )}

        {/* Tebrikler Modalı */}
        {isComplete && (
          <CongratulationsModal
            onContinue={handleContinue}
            onRestart={handleRestart}
            completedCards={flashcards.length}
            totalTime={calculateStudyTime()}
          />
        )}
      </div>
    </div>
  );
}