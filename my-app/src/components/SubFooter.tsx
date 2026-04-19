import type { ReactNode } from "react";

interface SubFooterProps {
  icon: ReactNode;
  title: string;
  desc: ReactNode;
}

const SubFooter = ({ icon, title, desc }: SubFooterProps) => {
  return (
    <div className="flex items-center gap-4 px-6 py-4 rounded-md flex-1">
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center">
        {icon}
      </div>

      {/* Text */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <p className="text-sm text-gray-500">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default SubFooter;