import { Bot } from "lucide-react";

export function NormitaPicture() {
  return (
    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-28 md:h-28 rounded-full flex items-center justify-center bg-gray-600 text-white">
      <img
        src="/Normita.png"
        alt="Normita"
        className="w-full h-full object-cover rounded-full"
        onError={(e) => {
          // Fallback to Bot icon if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.nextElementSibling?.classList.remove('hidden');
        }}
      />
      <Bot className="h-8 w-8 hidden" />
    </div>
  );
}