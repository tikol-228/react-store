import React from "react";
import { Sun } from "lucide-react";

const Banner: React.FC = () => {
  return (
    <section className="w-full bg-[#F3F4F0] min-h-[600px] flex items-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        
        {/* Left Content */}
        <div className="z-10 space-y-8 py-20">
          <div className="space-y-4">
            <span className="text-[#1B4B43] font-bold text-xs uppercase tracking-[0.2em]">Давайте знакомиться!</span>
            <h1 className="text-5xl lg:text-7xl font-medium text-[#1A1A1A] leading-[1.1]">
              Юля Зубкевич
            </h1>
            <p className="text-gray-500 max-w-md text-lg leading-relaxed">
              Я косметик-эстетист с высшим спортивным образованием. Более 13 лет (а может, и все 15 — время в любимой профессии летит незаметно!) я дарю красоту и здоровье коже.
            </p>
            <p className="text-gray-500 max-w-md text-lg leading-relaxed">
              Я не предлагаю процедуры «на один раз», я не навязываю лишнее, я предлагаю стратегии ухода и только то, что будет работать как актив, и работаю так, чтобы результат накапливался и усиливал вашу природную красоту.
            </p>
            <p className="text-gray-500 max-w-md text-lg leading-relaxed">
              Моя цель — показать вам эстетическое омоложение без единого укола.
            </p>
            <div className="space-y-2">
              <p className="text-gray-700 font-semibold">Что я делаю профессионально:</p>
              <ul className="text-gray-500 space-y-1">
                <li>✅ Массаж лица. Это мой ключ к разным проблемам! Методика Сергея Щуревича- это тяжелая артиллерия, которой я владею уже несколько лет!</li>
                <li>✅ Подбор домашнего ухода. Не знаете, какая сыворотка или крем «сработают» именно у вас? Сюда же — составлю персональный маршрут.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 font-semibold">Вы пришли по адресу, если:</p>
              <ul className="text-gray-500 space-y-1">
                <li>— Не знаете, с чего начать.</li>
                <li>— Потерялись среди советов и брендов.</li>
                <li>— Хотите результат, но против инъекций</li>
                <li>— Желаете получить стратегию ухода на долгий период.</li>
              </ul>
              <p className="text-gray-500 italic">Забота о сложном- моя задача и это просто!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="px-8 py-4 bg-[#1B4B43] text-white rounded-full font-medium hover:bg-[#2a6b5f] transition-all shadow-lg shadow-[#1B4B43]/20">
              Записаться
            </button>
            <button className="px-8 py-4 border border-gray-200 text-[#1A1A1A] rounded-full font-medium hover:bg-white transition-all">
              Обо мне
            </button>
          </div>

          <div className="pt-8 flex items-center gap-8">
            <div>
              <p className="text-2xl font-bold text-[#1A1A1A]">13+</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Лет опыта</p>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A1A]">1000+</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Довольных клиентов</p>
            </div>
          </div>
        </div>

        {/* Right Content - Visual */}
        <div className="relative hidden lg:block h-full">
          <div className="relative z-10 w-[500px] h-[600px] bg-[#E5E7E1] rounded-[40px] overflow-hidden ml-auto">
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