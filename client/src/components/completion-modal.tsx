import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  bonus: number;
  totalScore: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onReturnToLevelSelect: () => void;
  hasNextLevel: boolean;
}

export function CompletionModal({
  isOpen,
  onClose,
  score,
  bonus,
  totalScore,
  onNextLevel,
  onReplay,
  onReturnToLevelSelect,
  hasNextLevel
}: CompletionModalProps) {
  // Ambil level dari localStorage (atau props jika ada)
  const [level, setLevel] = useState<number>(1);
  useEffect(() => {
    const stored = localStorage.getItem("selectedLevel");
    if (stored) setLevel(Number(stored));
  }, [isOpen]);

  // Badge/achievement per level
  const badges = [
    { icon: "🥉", label: "Bronze Explorer" },
    { icon: "🥈", label: "Silver Explorer" },
    { icon: "🥇", label: "Gold Explorer" },
  ];
  const badge = badges[(level - 1) % badges.length];

  // Ucapan selamat acak
  const congratulations = [
    "Keren! Kamu berhasil menaklukkan level ini!",
    "Luar biasa, lanjut ke tantangan berikutnya!",
    "Selamat, kamu layak dapat badge ini!",
    "Mantap! Level selesai dengan sukses!",
    "Hebat, kamu pantas jadi juara!",
    "Wow, pencapaian yang luar biasa!",
    "Good job! Teruskan semangatmu!",
    "Bravo! Level ini bukan tandinganmu!"
  ];
  const [congrats, setCongrats] = useState(congratulations[0]);
  useEffect(() => {
    if (isOpen) {
      setCongrats(congratulations[Math.floor(Math.random() * congratulations.length)]);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 text-center">
        {/* Badge & ucapan selamat */}
        <div className="mb-4 flex flex-col items-center justify-center">
          <span className="text-5xl mb-2 animate-bounce-slow">{badge.icon}</span>
          <div className="text-lg font-bold text-yellow-600 mb-1">{badge.label}</div>
          <div className="text-base text-blue-700 font-semibold italic animate-fade-in-up">{congrats}</div>
        </div>
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Level Complete!</h3>
          <p className="text-gray-600">Congratulations on finishing the level!</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">+{bonus}</div>
              <div className="text-sm text-gray-600">Perfect Bonus</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-lg font-bold text-gray-800">{totalScore}</div>
            <div className="text-sm text-gray-600">Total Score</div>
          </div>
        </div>

        <div className="space-y-3">
          {hasNextLevel && (
            <Button 
              onClick={onNextLevel}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Next Level
            </Button>
          )}
          <Button 
            onClick={onReplay}
            variant="outline"
            className="w-full"
          >
            Play Again
          </Button>
          <Button 
            onClick={onReturnToLevelSelect}
            variant="ghost"
            className="w-full"
          >
            Back to Level Select
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
