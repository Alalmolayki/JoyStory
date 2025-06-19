import React from 'react';
import { Trophy, Star, ArrowRight, RotateCcw } from 'lucide-react';

interface CongratulationsModalProps {
  onContinue: () => void;
  onRestart: () => void;
  completedCards: number;
  totalTime?: string;
}

export function CongratulationsModal({ 
  onContinue, 
  onRestart, 
  completedCards, 
  totalTime 
}: CongratulationsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transition-colors duration-300">
        {/* Başarı Animasyonu */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Star className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Star className="h-4 w-4 text-yellow-400 animate-pulse delay-300" />
          </div>
        </div>

        {/* İçerik */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tebrikler! 🎉
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Bu çalışma seansını başarıyla tamamladınız ve tüm kavramlarda ustalaştınız!
        </p>

        {/* İstatistikler */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tamamlanan Kartlar</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{completedCards}</p>
            </div>
            {totalTime && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Harcanan Süre</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{totalTime}</p>
              </div>
            )}
          </div>
        </div>

        {/* Motivasyon Mesajı */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800 dark:text-green-200">
            <strong>Harika iş!</strong> Öğrenmeye olan mükemmel bağlılığınızı gösterdiniz. 
            Bu momentumu koruyun ve yeni konuları keşfetmeye devam edin!
          </p>
        </div>

        {/* Eylem Butonları */}
        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Öğrenmeye Devam Et
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>

          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Tekrar Gözden Geçir
          </button>
        </div>
      </div>
    </div>
  );
}