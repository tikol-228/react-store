import React from "react";
import { Sun } from "lucide-react";

const Banner: React.FC = () => {
  return (
    <section className="w-full bg-[#F3F4F0] min-h-[400px] sm:min-h-[600px] flex items-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center w-full">
        
        {/* Left Content */}
        <div className="z-10 space-y-6 sm:space-y-8 py-10 sm:py-20">
          <div className="space-y-2 sm:space-y-4">
            <span className="text-[#1B4B43] font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] block">Давайте знакомиться!</span>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-medium text-[#1A1A1A] leading-[1.1]">
              Юля Зубкевич
            </h1>
            <p className="text-sm sm:text-base text-gray-500 max-w-md leading-relaxed">
              Я косметик-эстетист с высшим спортивным образованием. Более 13 лет я дарю красоту и здоровье коже.
            </p>
            <p className="text-sm sm:text-base text-gray-500 max-w-md leading-relaxed hidden sm:block">
              Я не предлагаю процедуры «на один раз», я не навязываю лишнее, я предлагаю стратегии ухода и только то, что будет работать как актив.
            </p>
            <p className="text-sm sm:text-base text-gray-500 max-w-md leading-relaxed">
              Моя цель — показать вам эстетическое омоложение без единого укола.
            </p>
            <div className="space-y-1 sm:space-y-2 pt-2 sm:pt-4">
              <p className="text-sm sm:text-base text-gray-700 font-semibold">Что я делаю профессионально:</p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-0.5 sm:space-y-1">
                <li>✅ Массаж лица. Методика Сергея Щуревича</li>
                <li>✅ Подбор домашнего ухода персонально</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-[#1B4B43] text-white rounded-full font-medium text-sm sm:text-base hover:bg-[#2a6b5f] transition-all shadow-lg shadow-[#1B4B43]/20">
              Записаться
            </button>
            <button className="px-6 sm:px-8 py-3 sm:py-4 border border-gray-200 text-[#1A1A1A] rounded-full font-medium text-sm sm:text-base hover:bg-white transition-all">
              Обо мне
            </button>
          </div>

          <div className="pt-4 sm:pt-8 flex items-center gap-6 sm:gap-8">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">13+</p>
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Лет опыта</p>
            </div>
            <div className="w-px h-6 sm:h-8 bg-gray-200"></div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">1000+</p>
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Клиентов</p>
            </div>
          </div>
        </div>

        {/* Right Content - Visual */}
        <div className="relative hidden lg:block h-full">
          <div className="relative z-10 w-full h-[400px] lg:h-[600px] bg-[#E5E7E1] rounded-[40px] overflow-hidden">
            <img
              src="/IMG_0254.PNG"
              alt="Юля Зубкевич"
              className="w-full h-full object-cover grayscale-[20%] hover:scale-105 transition-transform duration-1000"
            />
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#D19D6B] rounded-full blur-[80px] opacity-20"></div>
          <div className="absolute top-20 -right-20 w-60 h-60 bg-[#1B4B43] rounded-full blur-[100px] opacity-10"></div>
          
          {/* Floating Card */}
          <div className="absolute bottom-20 left-0 z-20 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 animate-bounce-slow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1B4B43] rounded-full flex items-center justify-center text-white">
                <Sun size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Естественная красота</p>
                <p className="text-sm font-bold text-[#1A1A1A]">Без инъекций</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#EAECE6] -z-0 rounded-l-[100px]"></div>
    </section>
  );
};

export default Banner;