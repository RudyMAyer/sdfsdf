import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check } from "lucide-react";

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 text-center">
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
