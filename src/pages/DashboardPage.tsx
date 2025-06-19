import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play, Clock, Trophy, Plus, ArrowRight, History, Trash2, BarChart3, Calendar, Sparkles, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { FlashcardSet } from '../types';
import { CreateFlashcardSetModal } from '../components/CreateFlashcardSetModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFlashcardSets();
  }, [user]);

  const fetchFlashcardSets = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('flashcard_sets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      setFlashcardSets(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching flashcard sets:', error);
      setError(error instanceof Error ? error.message : 'Çalışma setleri yüklenemedi');
      toast.error('Çalışma setleriniz yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSet = () => {
    setShowCreateModal(true);
  };

  const handleSetCreated = (newSet: FlashcardSet) => {
    setFlashcardSets([newSet, ...flashcardSets]);
    setShowCreateModal(false);
    toast.success('Çalışma seti başarıyla oluşturuldu!');
  };

  const handleStartStudy = (setId: string) => {
    navigate(`/study/${setId}`);
  };

  const handleViewAnalysis = (setId: string) => {
    navigate(`/analysis/${setId}`);
  };

  const handleDeleteSet = async (setId: string, setTitle: string) => {
    if (!confirm(`"${setTitle}" setini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }

    setDeletingId(setId);
    try {
      const { error } = await supabase
        .from('flashcard_sets')
        .delete()
        .eq('id', setId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setFlashcardSets(flashcardSets.filter(set => set.id !== setId));
      toast.success('Çalışma seti başarıyla silindi');
    } catch (error) {
      console.error('Error deleting flashcard set:', error);
      toast.error('Çalışma seti silinemedi');
    } finally {
      setDeletingId(null);
    }
  };

  const currentSets = flashcardSets.filter(set => !set.completed);
  const pastSets = flashcardSets.filter(set => set.completed);
  const completedSets = pastSets.length;
  const totalSets = flashcardSets.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <LoadingSkeleton className="h-10 w-80 mb-3" />
            <LoadingSkeleton className="h-6 w-64" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <LoadingSkeleton className="h-12 w-12 rounded-xl mb-4" />
                <LoadingSkeleton className="h-4 w-24 mb-2" />
                <LoadingSkeleton className="h-8 w-16" />
              </div>
            ))}
          </div>

          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 dark:text-gray-400 mt-4">Kontrol paneliniz yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Bir şeyler ters gitti</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchFlashcardSets}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hoş Geldin Bölümü */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                Tekrar hoş geldin, <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">{user?.email?.split('@')[0]}</span>!
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">Öğrenme yolculuğuna devam etmeye hazır mısın?</p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Harika işler çıkarıyorsun!</span>
            </div>
          </div>
        </div>

        {/* Gelişmiş İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="ml-6">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Toplam Set</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalSets}</p>
                </div>
              </div>
              <div className="text-right">
                <TrendingUp className="h-5 w-5 text-green-500 mb-1" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Tüm zamanlar</p>
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div className="ml-6">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Tamamlanan</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedSets}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                  %{totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0}
                </div>
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="ml-6">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Devam Eden</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalSets - completedSets}</p>
                </div>
              </div>
              <div className="text-right">
                <Target className="h-5 w-5 text-purple-500 mb-1" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Aktif</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gelişmiş Sekmeler ve Oluştur Butonu */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-2xl shadow-inner">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center ${
                activeTab === 'current'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Play className="h-4 w-4 mr-2" />
              Mevcut Çalışmalar ({currentSets.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center ${
                activeTab === 'past'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <History className="h-4 w-4 mr-2" />
              Geçmiş Çalışmalar ({pastSets.length})
            </button>
          </div>

          <button
            onClick={handleCreateSet}
            className="group flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mr-3 group-hover:rotate-90 transition-transform duration-300">
              <Plus className="h-4 w-4" />
            </div>
            Yeni Set Oluştur
            <Sparkles className="h-5 w-5 ml-2 group-hover:animate-pulse" />
          </button>
        </div>

        {/* İçerik */}
        {activeTab === 'current' ? (
          // Mevcut Çalışmalar
          currentSets.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <BookOpen className="h-16 w-16 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Mevcut çalışma yok</h3>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                AI destekli çalışma seanslarıyla öğrenme yolculuğunuza başlamak için ilk flashcard setinizi oluşturun!
              </p>
              <button
                onClick={handleCreateSet}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <Plus className="h-6 w-6 mr-3" />
                İlk Setinizi Oluşturun
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentSets.map((set) => (
                <div
                  key={set.id}
                  className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Arka plan gradyanı */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                            {set.grade}. Sınıf
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {set.subject}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {set.topic}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteSet(set.id, `${set.subject} - ${set.topic}`)}
                        disabled={deletingId === set.id}
                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        {deletingId === set.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(set.created_at).toLocaleDateString('tr-TR')}
                      </div>
                      <button
                        onClick={() => handleStartStudy(set.id)}
                        className="flex items-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Devam Et
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // Geçmiş Çalışmalar
          pastSets.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <History className="h-16 w-16 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Henüz tamamlanmış çalışma yok</h3>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Öğrenme geçmişinizi ve detaylı analizlerinizi burada görmek için bazı çalışma seanslarını tamamlayın!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastSets.map((set) => (
                <div
                  key={set.id}
                  className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Arka plan gradyanı */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-900/10 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center mb-3 space-x-2">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                            {set.grade}. Sınıf
                          </span>
                          <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-3 py-1 rounded-full flex items-center">
                            <Trophy className="h-3 w-3 mr-1" />
                            Tamamlandı
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {set.subject}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {set.topic}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteSet(set.id, `${set.subject} - ${set.topic}`)}
                        disabled={deletingId === set.id}
                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        {deletingId === set.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(set.updated_at).toLocaleDateString('tr-TR')} tarihinde tamamlandı
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewAnalysis(set.id)}
                          className="flex items-center px-4 py-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200"
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analiz
                        </button>
                        <button
                          onClick={() => handleStartStudy(set.id)}
                          className="flex items-center px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Tekrar Et
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Oluştur Modal */}
      {showCreateModal && (
        <CreateFlashcardSetModal
          onClose={() => setShowCreateModal(false)}
          onSetCreated={handleSetCreated}
        />
      )}
    </div>
  );
}