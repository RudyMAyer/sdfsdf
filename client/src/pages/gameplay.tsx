import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGameState } from "../hooks/use-game-state";
import { CrosswordGridComponent } from "../components/crossword-grid";
import { CompletionModal } from "../components/completion-modal";
import { LEVEL_CONFIGS } from "../types/game";
import { useState, useEffect, useRef } from "react";
import type { CrosswordClue } from "../types/game";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { GameStats, GameProgress } from "@shared/schema";
import { X, Lightbulb, Car, Building2, Map, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameplayProps {
  level: number;
  onNavigateToLevelSelect: () => void;
  onNavigateToGameplay: (level: number) => void;
}

export function Gameplay({ level, onNavigateToLevelSelect, onNavigateToGameplay }: GameplayProps) {
  const queryClient = useQueryClient();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
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
      queryClient.invalidateQueries({ queryKey: ['/api/game-stats/1'] });
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

  const [zoom, setZoom] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 2));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.5));
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // State untuk clue pop up
  const [popupClue, setPopupClue] = useState<CrosswordClue | null>(null);
  const popupTimeout = useRef<NodeJS.Timeout | null>(null);

  // Start/stop timer
  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive]);

  // Stop timer saat level selesai
  useEffect(() => {
    const totalClues = gameState.gridState.clues.length;
    const completedClues = gameState.gridState.clues.filter(c => c.answered).length;
    if (completedClues === totalClues && totalClues > 0) {
      setIsTimerActive(false);
    }
  }, [gameState.gridState.clues]);

  // Reset timer saat level di-reset
  useEffect(() => {
    setTimer(0);
    setIsTimerActive(true);
  }, [level]);

  // Reset modal setiap kali level berubah
  useEffect(() => {
    setShowCompletionModal(false);
  }, [level]);

  // Format timer mm:ss
  const formatTimer = (t: number) => {
    const m = Math.floor(t / 60).toString().padStart(2, '0');
    const s = (t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Check for level completion
  useEffect(() => {
    const totalClues = gameState.gridState.clues.length;
    const completedClues = gameState.gridState.clues.filter(c => c.answered).length;
    
    if (completedClues === totalClues && totalClues > 0) {
      // Level completed
      let bonus = 300;
      if (gameState.hintsUsed === 0) {
        bonus = 1000;
      }
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
    // Simpan progress saat quit (dengan bonus)
    const totalClues = gameState.gridState.clues.length;
    const completedClues = gameState.gridState.clues.filter(c => c.answered).length;
    let bonus = 0;
    if (completedClues === totalClues && totalClues > 0) {
      bonus = gameState.hintsUsed === 0 ? 1000 : 300;
    }
    const finalScore = gameState.score + bonus;
    saveProgressMutation.mutate({
      userId: 1,
      level: gameState.currentLevel,
      score: finalScore,
      completed: false,
      hintsUsed: gameState.hintsUsed,
      totalQuestions: levelConfig?.totalQuestions || 0,
      answeredQuestions: completedClues,
      gridState: gameState.gridState,
    });
    // Update stats juga
    updateStatsMutation.mutate({
      totalScore: (gameStats?.totalScore || 0) + finalScore,
      levelsCompleted: gameStats?.levelsCompleted || 0
    });
    // Invalidate progress agar halaman list level dapat data terbaru
    queryClient.invalidateQueries({ queryKey: ['/api/game-progress/1'] });
    setShowExitModal(true);
  };

  const handleNextLevel = () => {
    const nextLevel = level + 1;
    const nextLevelConfig = LEVEL_CONFIGS.find(c => c.level === nextLevel);
    if (nextLevelConfig && level < 3) {
      setShowCompletionModal(false);
      onNavigateToGameplay(nextLevel);
    } else {
      onNavigateToLevelSelect();
    }
  };

  const handleReplay = () => {
    resetLevel(level);
    setShowCompletionModal(false);
  };

  const handleCellClick = (row: number, col: number) => {
    // Temukan clue yang terkait dengan cell ini
    const cell = gameState.gridState.cells[row][col];
    if (!cell || cell.isBlocked) return;
    // Pilih clue prioritas: across, lalu down
    let clueId: number | undefined = undefined;
    const acrossClue = gameState.gridState.clues.find(
      c => c.direction === 'across' && c.startRow === row && c.startCol === col
    ) || gameState.gridState.clues.find(
      c => c.direction === 'across' && cell.belongsToClues.includes(c.id)
    );
    const downClue = gameState.gridState.clues.find(
      c => c.direction === 'down' && c.startRow === row && c.startCol === col
    ) || gameState.gridState.clues.find(
      c => c.direction === 'down' && cell.belongsToClues.includes(c.id)
    );
    if (acrossClue) clueId = acrossClue.id;
    else if (downClue) clueId = downClue.id;
    if (clueId) {
      handleSelectClue(clueId);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      selectCell(row, col);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  // Tampilkan pop up saat clue dipilih
  const handleSelectClue = (clueId: number) => {
    const clue = gameState.gridState.clues.find(c => c.id === clueId);
    if (clue) {
      setPopupClue(clue);
      if (popupTimeout.current) clearTimeout(popupTimeout.current);
      popupTimeout.current = setTimeout(() => setPopupClue(null), 4000);
    }
    selectClue(clueId);
  };

  // Pastikan pop up bisa ditutup manual
  const handleClosePopup = () => {
    setPopupClue(null);
    if (popupTimeout.current) clearTimeout(popupTimeout.current);
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

  // Tema per level
  const levelThemes: { [key: number]: { bg: string; icon: JSX.Element; header: string; text: string; desc: string; pattern?: string } } = {
    1: {
      bg: 'from-blue-100 via-white to-blue-200',
      icon: <Car className="w-12 h-12 text-blue-600 drop-shadow-lg" />, 
      header: 'bg-gradient-to-r from-blue-700 to-blue-400',
      text: 'text-blue-700',
      desc: 'Tema: Mobil & Mesin. Tebak nama mobil, komponen, dan dunia otomotif!',
      pattern: 'bg-[url(/assets/pattern-gears.svg)] bg-repeat',
    },
    2: {
      bg: 'from-green-100 via-white to-green-200',
      icon: <Building2 className="w-12 h-12 text-green-600 drop-shadow-lg" />, 
      header: 'bg-gradient-to-r from-green-700 to-green-400',
      text: 'text-green-700',
      desc: 'Tema: Kota & Kabupaten Indonesia. Tebak nama daerah, ibukota, dan ciri khasnya!',
      pattern: 'bg-[url(/assets/pattern-city.svg)] bg-repeat',
    },
    3: {
      bg: 'from-orange-100 via-white to-orange-200',
      icon: <Map className="w-12 h-12 text-orange-600 drop-shadow-lg" />, 
      header: 'bg-gradient-to-r from-orange-700 to-orange-400',
      text: 'text-orange-700',
      desc: 'Tema: Programming & Database. Tebak istilah, bahasa, dan konsep database!',
      pattern: 'bg-[url(/assets/pattern-database.svg)] bg-repeat',
    },
  };
  const theme = levelThemes[level] || levelThemes[1];

  return (
    <div className={`min-h-screen p-4 py-6 bg-gradient-to-br ${theme.bg} ${theme.pattern || ''}`}>
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <Card className={`shadow-lg mb-6 ${theme.header} text-white`}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleExitLevel}
                  className="text-white hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </Button>
                <div className="flex items-center gap-3">
                  <span>{theme.icon}</span>
                  <div>
                    <h3 className="text-xl font-extrabold drop-shadow">{levelConfig.name}</h3>
                    <p className="text-sm opacity-80">{levelConfig.description}</p>
                    <p className="text-xs mt-1 italic opacity-90">{theme.desc}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                {/* Score Display */}
                <div className="text-center">
                  <div className="text-2xl font-bold">{gameState.score}</div>
                  <div className="text-xs opacity-80">Score</div>
                </div>
                {/* Timer */}
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold">{formatTimer(timer)}</div>
                  <div className="text-xs opacity-80">Timer</div>
                </div>
                {/* Progress */}
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {completedQuestions}/{levelConfig.totalQuestions}
                  </div>
                  <div className="text-xs opacity-80">Questions</div>
                </div>
                {/* Hints Remaining */}
                <div className="text-center">
                  <div className="text-lg font-bold text-amber-200">{gameState.hintsRemaining}</div>
                  <div className="text-xs opacity-80">Hints</div>
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
              onCellClick={handleCellClick}
              selectedClue={gameState.selectedClue}
              zoom={zoom}
              level={level}
            >
              {/* Zoom Controls inside grid panel */}
              <div className="flex items-center gap-2 mb-2">
                <Button onClick={handleZoomOut} size="icon" variant="outline">-</Button>
                <span className="text-xs text-gray-600">Zoom: {(zoom * 100).toFixed(0)}%</span>
                <Button onClick={handleZoomIn} size="icon" variant="outline">+</Button>
              </div>
            </CrosswordGridComponent>
            
            {/* Current Input Display */}
            <Card className="mt-4">
              <CardContent className="p-3">
                <div className="text-sm text-gray-600 mb-1">Current Answer:</div>
                <Input
                  ref={inputRef}
                  value={gameState.currentInput}
                  onChange={e => updateInput(e.target.value)}
                  placeholder="Type your answer here..."
                  className="mb-2"
                  disabled={false}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSubmitAnswer();
                    }
                  }}
                />
                <div className="flex justify-between">
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={!Boolean(gameState.currentInput && gameState.currentInput.trim())}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Answer
                  </Button>
                  <Button 
                    onClick={handleUseHint}
                    disabled={!!(
                      (gameState.hintsRemaining !== undefined && gameState.hintsRemaining <= 0) || 
                      !gameState.selectedClue ||
                      (gameState.selectedClue && ((gameState.gridState.clues.find(c => c.id === gameState.selectedClue)?.hintsUsed ?? 0) >= 2))
                    )}
                    variant="outline"
                    className="text-amber-600 border-amber-600 hover:bg-amber-50"
                  >
                    <Lightbulb className="w-4 h-4 mr-1" />
                    Use Hint (-50 pts)
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
                        onClick={() => handleSelectClue(clue.id)}
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
                            <span className="text-xs text-green-600 font-medium ml-2">✓</span>
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
                        onClick={() => handleSelectClue(clue.id)}
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
                            <span className="text-xs text-green-600 font-medium ml-2">✓</span>
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
                    onClick={() => setShowResetModal(true)}
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
        score={gameState.score + (gameState.hintsUsed === 0 ? 50 : 0)}
        bonus={gameState.hintsUsed === 0 ? 50 : 0}
        totalScore={(gameStats?.totalScore || 0) + gameState.score + (gameState.hintsUsed === 0 ? 50 : 0) - (gameState.score + (gameState.hintsUsed === 0 ? 50 : 0))}
        onNextLevel={handleNextLevel}
        onReplay={handleReplay}
        onReturnToLevelSelect={() => {
          setShowCompletionModal(false);
          onNavigateToLevelSelect();
        }}
        hasNextLevel={level < 3}
      />

      {/* Exit Level Modal */}
      <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exit Level</DialogTitle>
          </DialogHeader>
          <div className="mb-4 text-gray-700">Lu mau keluar bro? gak mau lanjut?</div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowExitModal(false)}>Resume</Button>
            <Button variant="destructive" onClick={onNavigateToLevelSelect}>Quit Level</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Level Modal */}
      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Level</DialogTitle>
          </DialogHeader>
          <div className="mb-4 text-gray-700">Lu mau reset bro? ilang lo progres di level ini!</div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowResetModal(false)}>Batal</Button>
            <Button variant="destructive" onClick={() => { setShowResetModal(false); resetLevel(level); }}>Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clue Pop Up */}
      {popupClue !== null && (
        <div className="fixed top-6 right-8 z-50 bg-white border border-blue-200 shadow-xl rounded-xl p-5 min-w-[260px] max-w-xs animate-fade-in-up">
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-blue-700 text-lg">Clue #{popupClue?.number}</div>
            <button onClick={handleClosePopup} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="text-gray-800 mb-2">{popupClue?.text}</div>
          <div className="text-xs text-gray-500 mb-1">{popupClue?.direction === 'across' ? 'Across' : 'Down'}</div>
          <div className="text-xs">
            Status: {popupClue?.answered ? <span className="text-green-600 font-bold">Sudah dijawab</span> : <span className="text-red-600 font-bold">Belum</span>}
          </div>
        </div>
      )}
    </div>
  );
}
