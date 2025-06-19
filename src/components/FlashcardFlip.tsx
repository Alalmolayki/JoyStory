import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Eye } from 'lucide-react';
import { Flashcard as FlashcardType } from '../types';

interface FlashcardFlipProps {
  flashcard: FlashcardType;
  onUnderstand: () => void;
  onDontUnderstand: () => void;
  currentIndex: number;
  totalCards: number;
}

export function FlashcardFlip({ 
  flashcard, 
  onUnderstand, 
  onDontUnderstand, 
  currentIndex, 
  totalCards 
}: FlashcardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* İlerleme Çubuğu */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Kart {currentIndex + 1} / {totalCards}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            %{Math.round(((currentIndex + 1) / totalCards) * 100)}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Flashcard Konteyneri */}
      <div className="perspective-1000 mb-8">
        <div
          className={`relative w-full h-80 transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
        >
          {/* Kartın Ön Yüzü */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 h-full flex flex-col justify-center">
              {flashcard.is_explanatory && (
                <div className="flex items-center mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Açıklama Kartı</span>
                </div>
              )}

              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="text-lg leading-relaxed text-gray-900 dark:text-gray-100 mb-6">
                  {flashcard.content}
                </p>

                <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
                  <Eye className="h-4 w-4 mr-2" />
                  Açıklamayı görmek için tıklayın
                </div>
              </div>
            </div>
          </div>

          {/* Kartın Arka Yüzü */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-600 p-8 h-full flex flex-col justify-center">
              <div className="text-center flex-1 flex flex-col justify-center">
                {flashcard.explanation ? (
                  <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Açıklama</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {flashcard.explanation}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                    <p className="text-gray-600 dark:text-gray-400 italic">
                      Bu kavram hakkında düşünün ve ne kadar iyi anladığınızı değerlendirin.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                  <Eye className="h-4 w-4 mr-2" />
                  Geri çevirmek için tıklayın
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Eylem Butonları */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onDontUnderstand}
          className="flex items-center justify-center px-8 py-4 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <XCircle className="h-5 w-5 mr-2" />
          Anlamadım
        </button>

        <button
          onClick={onUnderstand}
          className="flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Anladım
        </button>
      </div>
    </div>
  );
}