import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Brain, Target, Users, ArrowRight, Star, Zap, CheckCircle, Quote, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Giriş yapmış kullanıcıları dashboard'a yönlendir
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Kimlik doğrulama kontrol edilirken yükleme durumunu göster
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  // Giriş yapmış kullanıcılar için sadece yönlendirme
  if (user) {
    return null; // useEffect ile yönlendirilecek
  }

  return (
    <div className="space-y-20 transition-colors duration-300">
      {/* Ana Bölüm */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent animate-pulse">
                Keyifle
              </span>{' '}
              Öğren
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Öğrenme tarzınıza uyum sağlayan AI destekli flashcard'lar. 1-12. sınıf arası 
              tüm konularda kişiselleştirilmiş çalışma seanslarıyla öğrenmeyi keyifli ve etkili hale getirin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/signup"
                className="group px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                Ücretsiz Öğrenmeye Başla
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Giriş Yap
              </Link>
            </div>
            
            {/* Güven göstergeleri */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2 text-yellow-500" />
                <span>10k+ öğrenci tarafından güveniliyor</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                <span>%95 başarı oranı</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-blue-500" />
                <span>AI destekli öğrenme</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gelişmiş arka plan süslemeleri */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-900 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-800 dark:to-purple-900 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-indigo-200 to-indigo-300 dark:from-indigo-800 dark:to-indigo-900 rounded-full opacity-20 animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-800 dark:to-pink-900 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>
      </section>

      {/* Özellikler Bölümü */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Öğrenciler Neden JoyStudy'yi Seviyor
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              AI destekli platformumuz öğrenme ihtiyaçlarınıza uyum sağlayarak çalışmayı her zamankinden daha etkili ve keyifli hale getirir.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI Destekli Öğrenme</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Akıllı sistemimiz sınıf seviyenize ve ders ihtiyaçlarınıza özel kişiselleştirilmiş flashcard'lar oluşturarak optimal öğrenme sonuçları sağlar.
              </p>
            </div>

            <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Uyarlanabilir Öğrenme</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Bir konuda zorlanıyor musunuz? Karmaşık konuları basit, anlaşılır adımlara bölen ek açıklayıcı kartlar alın.
              </p>
            </div>

            <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tüm Dersler</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Matematik'ten Edebiyat'a, Fen'den Tarih'e - kapsamlı kapsama ile her derste güvenle ustalaşın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır Bölümü */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              JoyStudy Nasıl Çalışır
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Sadece üç basit adımda başlayın ve öğrenme deneyiminizi dönüştürün
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Konunuzu Seçin</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Sınıf seviyenizi, dersinizi ve çalışmak istediğiniz konuyu seçin. Sistemimiz her şeyi sizin için özelleştirecek.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Akıllıca Çalışın</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                AI'mız kişiselleştirilmiş flashcard'lar oluşturur. Anladığınız ve daha fazla çalışma gerektiren konuları hedefli öğrenme için işaretleyin.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Konularda Ustalaşın</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Her şeyi mükemmel ve güvenle anlayıncaya kadar zor konular için ek açıklamalar alın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Yorumlar Bölümü */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Öğrenciler Ne Diyor
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              JoyStudy ile öğrenimlerini dönüştüren öğrencilerden gerçek geri bildirimler
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative">
              <Quote className="h-8 w-8 text-blue-500 mb-4" />
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                "JoyStudy matematik notlarımı C'den A+'ya çıkarmama yardımcı oldu. AI açıklamaları karmaşık kavramları çok daha kolay anlaşılır hale getirdi!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  S
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Selin M.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">10. Sınıf Öğrencisi</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative">
              <Quote className="h-8 w-8 text-purple-500 mb-4" />
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                "Uyarlanabilir öğrenme özelliği harika! Neyle zorlandığımı tam olarak biliyor ve mükemmel açıklamalar sağlıyordu."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  M
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Mert K.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">8. Sınıf Öğrencisi</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative">
              <Quote className="h-8 w-8 text-indigo-500 mb-4" />
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                "JoyStudy'nin çalışmayı eğlenceli hale getirmesini seviyorum! Flashcard'lar çekici ve artık çalışma seanslarımı gerçekten dört gözle bekliyorum."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  E
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Elif T.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">12. Sınıf Öğrencisi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gelişmiş Özellikler Bölümü */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Gelişmiş Öğrenme Deneyimi
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Öğrenme yolculuğunuzu daha da iyi hale getiren yeni özellikler
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Etkileşimli Flashcard'lar</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                Açıklamaları görmek için kartları çevirin, ilerlemenizi takip edin ve anlayışınız hakkında anında geri bildirim alın.
              </p>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Akıcı kart çevirme animasyonları</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Gerçek zamanlı ilerleme takibi</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Anında geri bildirim sistemi</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Çalışma Analitiği</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                Çalışma seanslarınızın detaylı analizini görün, tamamlanma oranlarını takip edin ve geliştirilmesi gereken alanları belirleyin.
              </p>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Kapsamlı performans analitiği</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Tam çalışma geçmişi</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Detaylı ilerleme içgörüleri</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* İstatistikler Bölümü */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                10k+
              </div>
              <div className="text-lg font-medium text-gray-600 dark:text-gray-400">Öğrenen Öğrenci</div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                50k+
              </div>
              <div className="text-lg font-medium text-gray-600 dark:text-gray-400">Oluşturulan Flashcard</div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-400 dark:to-indigo-500 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                15+
              </div>
              <div className="text-lg font-medium text-gray-600 dark:text-gray-400">Kapsanan Ders</div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                %95
              </div>
              <div className="text-lg font-medium text-gray-600 dark:text-gray-400">Başarı Oranı</div>
            </div>
          </div>
        </div>
      </section>

      {/* Harekete Geçirme Bölümü */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Öğreniminizi Dönüştürmeye Hazır mısınız?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            JoyStudy ile zaten daha etkili öğrenen binlerce öğrenciye katılın. 
            Akademik başarıya giden yolculuğunuza bugün başlayın.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-10 py-4 text-xl font-bold text-blue-600 bg-white hover:bg-gray-50 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
          >
            Bugün Başlayın
            <Zap className="ml-3 h-6 w-6" />
          </Link>
        </div>
        
        {/* Arka plan süslemeleri */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-500"></div>
      </section>

      {/* Alt Bilgi */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  JoyStudy
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                AI destekli kişiselleştirilmiş öğrenme ile eğitimi dönüştürüyoruz. 
                Dünya çapında öğrenciler için çalışmayı daha etkili, ilgi çekici ve keyifli hale getiriyoruz.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Ürün</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Özellikler</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nasıl Çalışır</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fiyatlandırma</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SSS</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Şirket</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Destek</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 JoyStudy. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Gizlilik Politikası</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Kullanım Şartları</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}