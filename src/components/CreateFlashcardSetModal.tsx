import React, { useState } from 'react';
import { X, BookOpen, GraduationCap, Target, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { generateFlashcards } from '../lib/openai';
import { FlashcardSet } from '../types';
import { SUBJECTS, GRADES } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import toast from 'react-hot-toast';

interface CreateFlashcardSetModalProps {
  onClose: () => void;
  onSetCreated: (set: FlashcardSet) => void;
}

export function CreateFlashcardSetModal({ onClose, onSetCreated }: CreateFlashcardSetModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [grade, setGrade] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user || !grade || !subject || !topic) return;

    setIsGenerating(true);
    toast.loading('Çalışma setiniz oluşturuluyor...', { id: 'creating' });

    try {
      // Flashcard seti oluştur
      const { data: flashcardSet, error: setError } = await supabase
        .from('flashcard_sets')
        .insert({
          user_id: user.id,
          grade,
          subject,
          topic,
          completed: false,
        })
        .select()
        .single();

      if (setError) throw setError;

      // OpenAI kullanarak flashcard'lar oluştur
      const flashcardContents = await generateFlashcards(grade, subject, topic, 10);

      // Flashcard'ları veritabanına ekle
      const flashcardsToInsert = flashcardContents.map((content, index) => ({
        flashcard_set_id: flashcardSet.id,
        content: content.content,
        explanation: content.explanation,
        order_index: index,
        understood: false,
        needs_review: false,
        is_explanatory: false,
      }));

      const { error: flashcardsError } = await supabase
        .from('flashcards')
        .insert(flashcardsToInsert);

      if (flashcardsError) throw flashcardsError;

      toast.success('Çalışma seti başarıyla oluşturuldu!', { id: 'creating' });
      onSetCreated(flashcardSet);
    } catch (error) {
      console.error('Error creating flashcard set:', error);
      toast.error('Çalışma seti oluşturulamadı. Lütfen tekrar deneyin.', { id: 'creating' });
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return grade !== null;
      case 2:
        return subject !== '';
      case 3:
        return topic.trim() !== '';
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors duration-300">
        {/* Başlık */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Çalışma Seti Oluştur</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* İlerleme Çubuğu */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Adım {step} / 3</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">%{Math.round((step / 3) * 100)}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* İçerik */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sınıfınızı Seçin</h3>
                <p className="text-gray-600 dark:text-gray-400">Mevcut sınıf seviyenizi seçin</p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {GRADES.map((gradeOption) => (
                  <button
                    key={gradeOption}
                    onClick={() => setGrade(gradeOption)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      grade === gradeOption
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="font-semibold">{gradeOption}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ders Seçin</h3>
                <p className="text-gray-600 dark:text-gray-400">Hangi dersi çalışmak istiyorsunuz?</p>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {SUBJECTS.map((subjectOption) => (
                  <button
                    key={subjectOption}
                    onClick={() => setSubject(subjectOption)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                      subject === subjectOption
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {subjectOption}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Konu Girin</h3>
                <p className="text-gray-600 dark:text-gray-400">Hangi konuyu öğrenmek istiyorsunuz?</p>
              </div>

              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Konu
                </label>
                <textarea
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="örn: Fotosentez, İkinci Dünya Savaşı, İkinci Dereceden Denklemler..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">AI Destekli Öğrenme</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      AI'mız {grade}. Sınıf {subject} dersi "{topic}" konusu için kişiselleştirilmiş flashcard'lar oluşturacak
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alt Kısım */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={step === 1 ? onClose : handleBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {step === 1 ? 'İptal' : 'Geri'}
          </button>

          <button
            onClick={step === 3 ? handleSubmit : handleNext}
            disabled={!canProceed() || isGenerating}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Oluşturuluyor...
              </>
            ) : step === 3 ? (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Set Oluştur
              </>
            ) : (
              'İleri'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}