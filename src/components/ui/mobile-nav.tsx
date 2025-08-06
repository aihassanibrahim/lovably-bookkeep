import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";

interface MobileNavProps {
  onNavigate: (sectionId: string) => void;
  onLoginClick: () => void;
  onCTAClick: () => void;
}

export function MobileNav({ onNavigate, onLoginClick, onCTAClick }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (sectionId: string) => {
    onNavigate(sectionId);
    setIsOpen(false);
  };

  const handleLoginClick = () => {
    onLoginClick();
    setIsOpen(false);
  };

  const handleCTAClick = () => {
    onCTAClick();
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-2 space-y-1">
            <button
              onClick={() => handleNavigate("funktioner")}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
            >
              Funktioner
            </button>
            <button
              onClick={() => handleNavigate("priser")}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
            >
              Priser
            </button>
            <button
              onClick={() => handleNavigate("faq")}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
            >
              FAQ
            </button>
            
            <div className="border-t border-gray-200 pt-2 mt-2">
              <Button
                onClick={handleLoginClick}
                variant="outline"
                className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Logga in
              </Button>
            </div>
            
            <Button
              onClick={handleCTAClick}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
                              Kom igång free
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 