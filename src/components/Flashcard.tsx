import React from 'react';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Flashcard as FlashcardType } from '../types';

interface FlashcardProps {
  flashcard: FlashcardType;
  onUnderstand: () => void;
  onDontUnderstand: () => void;
  currentIndex: number;
  totalCards: number;
}

export function Flashcard({ 
  flashcard, 
  onUnderstand, 
  onDontUnderstand, 
  currentIndex, 
  totalCards 
}: FlashcardProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* İlerleme Çubuğu */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Kart {currentIndex + 1} / {totalCards}
          </span>
          <span className="text-sm text-gray-500">
            %{Math.round(((currentIndex + 1) / totalCards) * 100)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 min-h-[300px] flex flex-col justify-center">
        {flashcard.is_explanatory && (
          <div className="flex items-center mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <Lightbulb className="h-5 w-5 text-amber-600 mr-2" />
            <span className="text-sm font-medium text-amber-800">Açıklama Kartı</span>
          </div>
        )}

        <div className="text-center">
          <p className="text-lg leading-relaxed text-gray-900 mb-6">
            {flashcard.content}
          </p>

          {flashcard.explanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Açıklama:</strong> {flashcard.explanation}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Eylem Butonları */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onDontUnderstand}
          className="flex items-center justify-center px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <XCircle className="h-5 w-5 mr-2" />
          Anlamadım
        </button>

        <button
          onClick={onUnderstand}
          className="flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Anladım
        </button>
      </div>
    </div>
  );
}