import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CategoryOption {
  id: number;
  name: string;
}

interface CategorySelectProps {
  categories: CategoryOption[];
  value: string;
  onChange: (categoryId: string) => void;
  placeholder?: string;
  className?: string;
}

const CategorySelect = ({
  categories,
  value,
  onChange,
  placeholder = 'Выберите категорию',
  className = '',
}: CategorySelectProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = categories.find((c) => String(c.id) === value);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm hover:border-[#1B4B43]/40"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-500'}>
          {selected?.name ?? placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 pt-1">
          <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className="block w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-50"
            >
              {placeholder}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onChange(String(c.id));
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#1B4B43]/5 ${
                  String(c.id) === value
                    ? 'font-semibold text-[#1B4B43] bg-[#1B4B43]/5'
                    : 'text-gray-800'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
