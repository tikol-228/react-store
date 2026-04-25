import type { ReactNode } from "react";

interface SubFooterProps {
  icon: ReactNode;
  title: string;
  desc: ReactNode;
}

const SubFooter = ({ icon, title, desc }: SubFooterProps) => {
  return (
    <div className="flex flex-col items-center text-center gap-4 group">
      {/* Icon Container */}
      <div className="transition-transform duration-300 group-hover:-translate-y-1">
        {icon}
      </div>

      {/* Text Content */}
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default SubFooter;