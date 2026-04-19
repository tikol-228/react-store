import React, { useEffect, useState } from "react";
import model from "../public/model.png";
import leftDecor from "../public/Vector.png";

const Banner: React.FC = () => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full bg-[#e6efec] overflow-hidden pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 flex items-center justify-between relative">

        {/* ЛЕВЫЙ ДЕКОР (PARALLAX) */}
        <div
          className="absolute -left-40 top-10 w-[700px] opacity-70 pointer-events-none z-0"
          style={{
            transform: `translateY(${offsetY * 0.2}px)`
          }}
        >
          <img
            src={leftDecor}
            alt="декор"
            className="w-full h-auto scale-125"
          />
        </div>

        {/* ЛЕВЫЙ КОНТЕНТ */}
        <div className="max-w-xl z-10">
          <h1 className="text-5xl font-semibold text-[#0f3d2e] leading-tight">
            Побалуйте свою кожу <br />
            натуральными <br />
            ингредиентами
          </h1>

          <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            Здесь вы найдёте уход за кожей, идеально подходящий именно вам.
            Мы используем только натуральные ингредиенты
          </p>

          <button className="mt-6 px-6 py-3 bg-[#0f3d2e] text-white rounded-md hover:opacity-90 transition">
            Перейти к товарам
          </button>
        </div>

        {/* ПРАВАЯ КАРТИНКА */}
        <div className="relative w-[400px] h-[400px] flex items-center justify-center z-10">
          <div className="w-full h-full rounded-full overflow-hidden">
            <img
              src={model}
              alt="модель"
              className="w-full h-full object-cover scale-110"
            />
          </div>

          <div className="absolute w-[450px] h-[450px] border-2 border-[#0f3d2e]/20 rounded-full"></div>
        </div>

        {/* ЗВЁЗДЫ */}
        <div className="absolute right-[30%] top-[30%] text-[#0f3d2e] text-2xl z-10">
          ✦
        </div>
        <div className="absolute right-[20%] top-[50%] text-[#0f3d2e] text-xl z-10">
          ✦
        </div>

      </div>
    </section>
  );
};

export default Banner;