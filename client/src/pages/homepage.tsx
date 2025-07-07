import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { GameStats } from "@shared/schema";
import { useState } from "react";
import { InstructionsModal } from "../components/instructions-modal";

interface HomepageProps {
  onNavigateToLevelSelect: () => void;
}

export function Homepage({ onNavigateToLevelSelect }: HomepageProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  
  const { data: gameStats } = useQuery<GameStats>({
    queryKey: ['/api/game-stats/1']
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          {/* Game logo/title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">TTS Explorer</h1>
          <p className="text-lg text-gray-600 mb-8">Master the art of crossword puzzles!</p>
          
          {/* Game stats overview */}
          <Card className="shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {gameStats?.totalScore || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {gameStats?.levelsCompleted || 0}
                  </div>
                  <div className="text-sm text-gray-600">Levels Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main action buttons */}
        <div className="space-y-4">
          <Button 
            onClick={onNavigateToLevelSelect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 text-lg shadow-lg"
          >
            Start Playing
          </Button>
          
          <Button 
            onClick={() => setShowInstructions(true)}
            variant="outline"
            className="w-full font-semibold py-3 px-8 shadow-md"
          >
            How to Play
          </Button>
        </div>
      </div>

      <InstructionsModal 
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
    </div>
  );
}
