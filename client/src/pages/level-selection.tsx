import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { GameStats, GameProgress } from "@shared/schema";
import { LEVEL_CONFIGS } from "../types/game";
import { Lock, CheckCircle } from "lucide-react";

interface LevelSelectionProps {
  onNavigateToHomepage: () => void;
  onPlayLevel: (level: number) => void;
}

export function LevelSelection({ onNavigateToHomepage, onPlayLevel }: LevelSelectionProps) {
  const { data: gameStats } = useQuery<GameStats>({
    queryKey: ['/api/game-stats/1']
  });

  const { data: allProgress = [] } = useQuery<GameProgress[]>({
    queryKey: ['/api/game-progress/1']
  });

  const getProgressForLevel = (level: number) => {
    return allProgress.find(p => p.level === level);
  };

  const isLevelUnlocked = (level: number) => {
    if (level === 1) return true;
    const config = LEVEL_CONFIGS.find(c => c.level === level);
    return (gameStats?.totalScore || 0) >= (config?.unlockRequirement || 0);
  };

  const getLevelStatus = (level: number) => {
    const progress = getProgressForLevel(level);
    if (!isLevelUnlocked(level)) return 'locked';
    if (progress?.completed) return 'complete';
    return 'available';
  };

  const getLevelCardClass = (status: string) => {
    switch (status) {
      case 'complete':
        return 'level-card-complete text-white';
      case 'locked':
        return 'level-card-locked text-white opacity-75';
      default:
        return 'bg-white border-2 border-blue-600';
    }
  };

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Challenge</h2>
          <p className="text-gray-600">Select a level to start your crossword adventure</p>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {LEVEL_CONFIGS.map((config) => {
            const status = getLevelStatus(config.level);
            const progress = getProgressForLevel(config.level);
            const unlocked = isLevelUnlocked(config.level);

            return (
              <Card key={config.level} className={`${getLevelCardClass(status)} shadow-lg`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{config.name}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      status === 'complete' ? 'bg-white bg-opacity-20' :
                      status === 'locked' ? 'bg-white bg-opacity-20' :
                      'bg-blue-600 text-white'
                    }`}>
                      {status === 'complete' && (
                        <>
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Complete
                        </>
                      )}
                      {status === 'locked' && (
                        <>
                          <Lock className="w-4 h-4 inline mr-1" />
                          Locked
                        </>
                      )}
                      {status === 'available' && 'Available'}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className={`mb-2 ${status === 'available' ? 'text-gray-600' : 'text-white text-opacity-90'}`}>
                      {config.description}
                    </p>
                    
                    {progress?.completed && (
                      <>
                        <div className="text-2xl font-bold">{progress.score}</div>
                        <div className="text-sm text-white text-opacity-75">Your Best Score</div>
                      </>
                    )}
                    
                    {!unlocked && (
                      <>
                        <div className="text-sm text-white text-opacity-75">
                          Required: {config.unlockRequirement.toLocaleString()} points
                        </div>
                        <div className="text-xs text-white text-opacity-60 mt-1">
                          Complete previous levels first
                        </div>
                      </>
                    )}
                    
                    {unlocked && !progress?.completed && (
                      <>
                        <div className="text-sm text-gray-500">
                          Required: {config.unlockRequirement.toLocaleString()} points
                        </div>
                        <div className="text-xs text-green-600 mt-1">✓ Requirement met!</div>
                      </>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => onPlayLevel(config.level)}
                    disabled={!unlocked}
                    className={`w-full ${
                      status === 'complete' ? 'bg-white bg-opacity-20 hover:bg-opacity-30' :
                      status === 'locked' ? 'bg-white bg-opacity-20 cursor-not-allowed' :
                      'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    variant={status === 'available' ? 'default' : 'ghost'}
                  >
                    {status === 'complete' ? 'Play Again' :
                     status === 'locked' ? 'Locked' :
                     'Start Level'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Button 
            onClick={onNavigateToHomepage}
            variant="outline"
            className="font-medium py-3 px-6"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
