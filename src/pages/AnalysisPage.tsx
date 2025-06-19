import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, CheckCircle, XCircle, Brain, Calendar, Clock, Target } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { FlashcardSet, Flashcard } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface AnalysisData {
  totalCards: number;
  understoodCards: number;
  reviewCards: number;
  explanatoryCards: number;
  completionRate: number;
  studyTime?: string;
}

export function AnalysisPage() {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (setId && user) {
      fetchAnalysisData();
    }
  }, [setId, user]);

  const fetchAnalysisData = async () => {
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
          throw new Error('Çalışma seansı bulunamadı veya erişim izniniz yok');
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

      // Analizi hesapla
      const totalCards = cards.length;
      const understoodCards = cards.filter(card => card.understood).length;
      const reviewCards = cards.filter(card => card.needs_review).length;
      const explanatoryCards = cards.filter(card => card.is_explanatory).length;
      const completionRate = totalCards > 0 ? (understoodCards / totalCards) * 100 : 0;

      setAnalysis({
        totalCards,
        understoodCards,
        reviewCards,
        explanatoryCards,
        completionRate
      });
    } catch (error) {
      console.error('Error fetching analysis data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Analiz verileri yüklenemedi';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400 mt-4">Analiz yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analiz Yüklenemedi</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchAnalysisData}
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

  if (!flashcardSet || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Analiz verileri mevcut değil</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{flashcardSet.subject}</h1>
            <p className="text-gray-600 dark:text-gray-400">{flashcardSet.topic} • {flashcardSet.grade}. Sınıf</p>
          </div>
          
          <div className="w-32"></div> {/* Ortalama için boşluk */}
        </div>

        {/* Genel İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Kart</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.totalCards}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Anlaşılan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.understoodCards}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gözden Geçirilmeli</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.reviewCards}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Açıklamalar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.explanatoryCards}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tamamlanma Oranı */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tamamlanma Oranı</h2>
          <div className="flex items-center mb-4">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 mr-4">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${analysis.completionRate}%` }}
              ></div>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              %{Math.round(analysis.completionRate)}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {analysis.totalCards} kavramdan {analysis.understoodCards} tanesini anladınız
          </p>
        </div>

        {/* Seans Detayları */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Seans Detayları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Başlangıç</p>
                <p className="text-gray-900 dark:text-white">{new Date(flashcardSet.created_at).toLocaleDateString('tr-TR')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tamamlandı</p>
                <p className="text-gray-900 dark:text-white">
                  {flashcardSet.completed 
                    ? new Date(flashcardSet.updated_at).toLocaleDateString('tr-TR')
                    : 'Devam Ediyor'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detaylı Kart Analizi */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Kart Detayları</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {flashcards.map((card, index) => (
              <div
                key={card.id}
                className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-3">
                      #{index + 1}
                    </span>
                    {card.is_explanatory && (
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20 px-2 py-1 rounded-full mr-2">
                        Açıklama
                      </span>
                    )}
                    {card.understood ? (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : card.needs_review ? (
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                    {card.content}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    card.understood
                      ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/20'
                      : card.needs_review
                      ? 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/20'
                      : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600'
                  }`}>
                    {card.understood ? 'Anlaşıldı' : card.needs_review ? 'Gözden Geçirilmeli' : 'Denenmedi'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}