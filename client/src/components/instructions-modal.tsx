import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              How to Play TTS Explorer
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Game Basics */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">🎯 Game Basics</h4>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li>• Complete crossword puzzles by filling in the grid</li>
              <li>• Use clues to determine the correct answers</li>
              <li>• Progress through 4 increasingly difficult levels</li>
              <li>• Earn points for correct answers and perfect completion</li>
            </ul>
          </div>

          {/* Scoring System */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">⭐ Scoring System</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Correct Answer:</span>
                  <span className="font-medium text-green-600">+100 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Perfect Level:</span>
                  <span className="font-medium text-green-600">+50 bonus</span>
                </div>
                <div className="flex justify-between">
                  <span>Wrong Answer:</span>
                  <span className="font-medium text-red-600">-5 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Use Hint:</span>
                  <span className="font-medium text-amber-600">-5 points</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hint System */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">💡 Hint System</h4>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li>• You get 3 hints per game session</li>
              <li>• Wrong answers automatically reveal a random letter</li>
              <li>• Manual hints cost 5 points but don't count as wrong answers</li>
              <li>• Use hints strategically to maintain your score</li>
            </ul>
          </div>

          {/* Level Progression */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">🔓 Level Progression</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Level 1:</span> 20 Questions (Easy)
                </div>
                <span className="text-sm text-gray-600">Always Available</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Level 2:</span> 25 Questions (Medium)
                </div>
                <span className="text-sm text-gray-600">Requires 1,800 pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Level 3:</span> 30 Questions (Hard)
                </div>
                <span className="text-sm text-gray-600">Requires 2,250 pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Level 4:</span> 40 Questions (Very Hard)
                </div>
                <span className="text-sm text-gray-600">Requires 3,650 pts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 px-6">
            Got It!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
