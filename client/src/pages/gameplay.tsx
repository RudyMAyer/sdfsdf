import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGameState } from "../hooks/use-game-state";
import { CrosswordGridComponent } from "../components/crossword-grid";
import { CompletionModal } from "../components/completion-modal";
import { LEVEL_CONFIGS } from "../types/game";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { GameStats, GameProgress } from "@shared/schema";
import { X, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameplayProps {
  level: number;
  onNavigateToLevelSelect: () => void;
}

export function Gameplay({ level, onNavigateToLevelSelect }: GameplayProps) {
  const queryClient = useQueryClient();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const levelConfig = LEVEL_CONFIGS.find(c => c.level === level);
  
  const {
    gameState,
    selectCell,
    selectClue,
    updateInput,
    submitAnswer,
    manualHint,
    resetLevel,
  } = useGameState(level);

  const { data: gameStats } = useQuery<GameStats>({
    queryKey: ['/api/game-stats/1']
  });

  const saveProgressMutation = useMutation({
    mutationFn: async (progressData: Partial<GameProgress>) => {
      return await apiRequest('POST', '/api/game-progress', progressData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/game-progress/1'] });
    }
  });

  const updateStatsMutation = useMutation({
    mutationFn: async (statsData: Partial<GameStats>) => {
      return await apiRequest('PATCH', '/api/game-stats/1', statsData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/game-stats/1'] });
    }
  });

  // Check for level completion
  useEffect(() => {
    const totalClues = gameState.gridState.clues.length;
    const completedClues = gameState.gridState.clues.filter(c => c.answered).length;
    
    if (completedClues === totalClues && totalClues > 0) {
      // Level completed
      const bonus = gameState.hintsUsed === 0 ? 50 : 0;
      const finalScore = gameState.score + bonus;
      
      // Save progress
      saveProgressMutation.mutate({
        userId: 1,
        level: gameState.currentLevel,
        score: finalScore,
        completed: true,
        hintsUsed: gameState.hintsUsed,
        totalQuestions: levelConfig?.totalQuestions || 0,
        answeredQuestions: completedClues,
        gridState: gameState.gridState,
      });

      // Update total stats
      const newTotalScore = (gameStats?.totalScore || 0) + finalScore;
      const newLevelsCompleted = Math.max(gameStats?.levelsCompleted || 0, level);
      
      updateStatsMutation.mutate({
        totalScore: newTotalScore,
        levelsCompleted: newLevelsCompleted,
      });

      setShowCompletionModal(true);
    }
  }, [gameState.gridState.clues, gameState.score, gameState.hintsUsed, gameState.currentLevel, levelConfig?.totalQuestions, gameStats, saveProgressMutation, updateStatsMutation, level]);

  const handleSubmitAnswer = () => {
    if (gameState.currentInput.trim()) {
      submitAnswer(gameState.currentInput.trim());
    }
  };

  const handleUseHint = () => {
    manualHint();
  };

  const handleExitLevel = () => {
    if (window.confirm('Are you sure you want to exit this level? Your progress will be lost.')) {
      onNavigateToLevelSelect();
    }
  };

  const handleNextLevel = () => {
    const nextLevel = level + 1;
    const nextLevelConfig = LEVEL_CONFIGS.find(c => c.level === nextLevel);
    if (nextLevelConfig) {
      resetLevel(nextLevel);
      setShowCompletionModal(false);
    } else {
      onNavigateToLevelSelect();
    }
  };

  const handleReplay = () => {
    resetLevel(level);
    setShowCompletionModal(false);
  };

  if (!levelConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Level Not Found</h2>
          <Button onClick={onNavigateToLevelSelect}>Back to Level Select</Button>
        </div>
      </div>
    );
  }

  const acrossClues = gameState.gridState.clues.filter(c => c.direction === 'across');
  const downClues = gameState.gridState.clues.filter(c => c.direction === 'down');
  const completedQuestions = gameState.gridState.clues.filter(c => c.answered).length;

  return (
    <div className="min-h-screen p-4 py-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Game Header */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleExitLevel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </Button>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{levelConfig.name}</h3>
                  <p className="text-sm text-gray-600">{levelConfig.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* Score Display */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
                  <div className="text-xs text-gray-600">Score</div>
                </div>
                
                {/* Progress */}
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800">
                    {completedQuestions}/{levelConfig.totalQuestions}
                  </div>
                  <div className="text-xs text-gray-600">Questions</div>
                </div>
                
                {/* Hints Remaining */}
                <div className="text-center">
                  <div className="text-lg font-bold text-amber-600">{gameState.hintsRemaining}</div>
                  <div className="text-xs text-gray-600">Hints</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Crossword Grid */}
          <div className="lg:col-span-2">
            <CrosswordGridComponent
              gridState={gameState.gridState}
              selectedCell={gameState.selectedCell}
              onCellClick={selectCell}
            />
            
            {/* Current Input Display */}
            <Card className="mt-4">
              <CardContent className="p-3">
                <div className="text-sm text-gray-600 mb-1">Current Answer:</div>
                <Input
                  value={gameState.currentInput}
                  onChange={(e) => updateInput(e.target.value)}
                  placeholder="Type your answer here..."
                  className="mb-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmitAnswer();
                    }
                  }}
                />
                <div className="flex justify-between">
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={!gameState.currentInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Answer
                  </Button>
                  <Button 
                    onClick={handleUseHint}
                    disabled={
                      gameState.hintsRemaining <= 0 || 
                      !gameState.selectedClue ||
                      (gameState.selectedClue && gameState.gridState.clues.find(c => c.id === gameState.selectedClue)?.hintsUsed >= 2)
                    }
                    variant="outline"
                    className="text-amber-600 border-amber-600 hover:bg-amber-50"
                  >
                    <Lightbulb className="w-4 h-4 mr-1" />
                    Use Hint (-5 pts)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clues Panel */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Clues</h4>
                
                {/* Across Clues */}
                <div className="mb-6">
                  <h5 className="font-medium text-gray-700 mb-3">Across</h5>
                  <div className="space-y-2">
                    {acrossClues.map((clue) => (
                      <div
                        key={clue.id}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-colors",
                          clue.answered 
                            ? "bg-green-50 border-green-200" 
                            : gameState.selectedClue === clue.id
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        )}
                        onClick={() => selectClue(clue.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <span className={cn(
                              "font-medium",
                              clue.answered ? "text-green-600" : "text-gray-600"
                            )}>
                              {clue.number}.
                            </span>
                            <span className="text-sm text-gray-700 ml-1">{clue.text}</span>
                            {clue.hintsUsed > 0 && (
                              <span className="text-xs text-amber-600 ml-2">
                                ({clue.hintsUsed}/2 hints)
                              </span>
                            )}
                          </div>
                          {clue.answered && (
                            <span className="text-xs text-green-600 font-medium">✓</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Down Clues */}
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Down</h5>
                  <div className="space-y-2">
                    {downClues.map((clue) => (
                      <div
                        key={clue.id}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-colors",
                          clue.answered 
                            ? "bg-green-50 border-green-200" 
                            : gameState.selectedClue === clue.id
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        )}
                        onClick={() => selectClue(clue.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <span className={cn(
                              "font-medium",
                              clue.answered ? "text-green-600" : "text-gray-600"
                            )}>
                              {clue.number}.
                            </span>
                            <span className="text-sm text-gray-700 ml-1">{clue.text}</span>
                            {clue.hintsUsed > 0 && (
                              <span className="text-xs text-amber-600 ml-2">
                                ({clue.hintsUsed}/2 hints)
                              </span>
                            )}
                          </div>
                          {clue.answered && (
                            <span className="text-xs text-green-600 font-medium">✓</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Actions */}
            <Card className="shadow-lg mt-6">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Game Actions</h4>
                <div className="space-y-3">
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => resetLevel(level)}
                  >
                    ⏸️ Restart Level
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full text-red-600 border-red-600 hover:bg-red-50"
                    onClick={handleExitLevel}
                  >
                    ❌ Exit Level
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        score={gameState.score}
        bonus={gameState.hintsUsed === 0 ? 50 : 0}
        totalScore={(gameStats?.totalScore || 0) + gameState.score + (gameState.hintsUsed === 0 ? 50 : 0)}
        onNextLevel={handleNextLevel}
        onReplay={handleReplay}
        onReturnToLevelSelect={() => {
          setShowCompletionModal(false);
          onNavigateToLevelSelect();
        }}
        hasNextLevel={level < LEVEL_CONFIGS.length}
      />
    </div>
  );
}
