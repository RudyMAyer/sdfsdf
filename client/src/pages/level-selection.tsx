import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { GameStats, GameProgress } from "@shared/schema";
import { LEVEL_CONFIGS } from "../types/game";
import { Sparkles, Award, Lock, CheckCircle, Star, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface LevelSelectionProps {
  onNavigateToHomepage: () => void;
  onPlayLevel: (level: number) => void;
}

export function LevelSelection({ onNavigateToHomepage, onPlayLevel }: LevelSelectionProps) {
  const { data: gameStats } = useQuery<GameStats>({
    queryKey: ['/api/game-stats/1']
  });

  const { data: allProgress = [], refetch } = useQuery<GameProgress[]>({
    queryKey: ['/api/game-progress/1']
  });

  // Selalu refresh data progress saat halaman ini dibuka
  useEffect(() => {
    refetch();
    console.log('allProgress:', allProgress);
  }, []);

  // Ambil skor tertinggi dari semua progress pada level tersebut
  const getProgressForLevel = (level: number) => {
    const progresses = allProgress.filter(p => p.level === level);
    if (progresses.length === 0) return undefined;
    // Ambil progress dengan skor tertinggi
    return progresses.reduce((max, curr) => (curr.score > (max?.score || 0) ? curr : max), progresses[0]);
  };

  // Semua level selalu terbuka
  const isLevelUnlocked = (_level: number) => true;

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

  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen p-4 py-8 bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col items-center justify-center">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl shadow-2xl mb-6 animate-fade-in-up">
            <Award className="w-14 h-14 text-white drop-shadow-lg" />
          </div>
          <h2 className="text-5xl font-extrabold text-gray-800 mb-2 drop-shadow-lg tracking-tight">Pilih Level</h2>
          <p className="text-lg text-gray-600 mb-2 font-medium">Mulai petualangan TTS-mu dari level mudah hingga tersulit!</p>
          <p className="text-base text-gray-500 max-w-xl mx-auto">Setiap level punya tantangan dan skor minimal untuk membuka level berikutnya. Raih skor terbaikmu dan buka semua level!</p>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {LEVEL_CONFIGS.map((config, idx) => {
            const status = getLevelStatus(config.level);
            const progress = getProgressForLevel(config.level);
            const unlocked = isLevelUnlocked(config.level);
            const levelIcons = [
              <Sparkles className='w-10 h-10 text-yellow-400 drop-shadow' />,
              <Star className='w-10 h-10 text-blue-400 drop-shadow' />,
              <Award className='w-10 h-10 text-green-500 drop-shadow' />
            ];
            const badgeColor = status === 'complete' ? 'bg-green-500' : status === 'locked' ? 'bg-gray-400' : 'bg-blue-600';
            const badgeText = status === 'complete' ? 'Selesai' : status === 'locked' ? 'Terkunci' : 'Tersedia';
            return (
              <Card key={config.level} className={`relative overflow-visible shadow-xl border-0 bg-white/90 backdrop-blur-md transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl animate-fade-in-up`}>  
                {/* Badge */}
                <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold text-white shadow ${badgeColor}`}>{badgeText}</div>
                {/* Level Number Background */}
                <div className="absolute -top-8 -right-8 opacity-10 text-[7rem] select-none pointer-events-none font-extrabold">{config.level}</div>
                <CardContent className="p-8 flex flex-col items-center">
                  <div className="flex flex-col items-center mb-4">
                    <span className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-2xl shadow-lg mb-2">{levelIcons[config.level-1]}</span>
                    <h3 className="text-2xl font-bold text-gray-800 drop-shadow mb-1 tracking-tight">{config.name}</h3>
                  </div>
                  <p className="mb-3 text-center text-gray-600 text-base min-h-[48px]">{config.description}</p>
                  {progress?.completed && (
                    <div className="flex items-center gap-2 mt-2 mb-2">
                      <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold"><Star className="w-4 h-4 mr-1" /> Rekor: {progress.score}</span>
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold"><CheckCircle className="w-4 h-4 mr-1" /> Selesai</span>
                    </div>
                  )}
                  {/* Semua level selalu terbuka, tidak ada syarat skor */}
                  <Button 
                    onClick={() => onPlayLevel(config.level)}
                    disabled={!unlocked}
                    className={`w-full py-3 text-lg font-bold rounded-xl shadow-md mt-4 transition-all duration-200 ${
                      status === 'complete' ? 'bg-green-500 hover:bg-green-600 text-white' :
                      status === 'locked' ? 'bg-gray-400 cursor-not-allowed text-white' :
                      'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    variant={status === 'available' ? 'default' : 'ghost'}
                  >
                    {status === 'complete' ? 'Main Lagi' :
                     status === 'locked' ? 'Terkunci' :
                     'Mulai Level'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {/* Info Box */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowInfo(true)}
            className="max-w-xl w-full bg-yellow-50 border-l-4 border-yellow-400 rounded-xl shadow p-5 flex items-center gap-3 transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:bg-yellow-100 cursor-pointer group animate-fade-in-up"
            style={{ outline: 'none' }}
          >
            <span className="text-3xl animate-bounce-slow group-hover:scale-110 transition-transform">😊</span>
            <div className="text-gray-700 text-base font-semibold group-hover:text-yellow-700">
              Info & Ucapan
            </div>
          </button>
        </div>
        <Dialog open={showInfo} onOpenChange={setShowInfo}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">😊</span> Informasi & Ucapan
                </DialogTitle>
                <button onClick={() => setShowInfo(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
              </div>
            </DialogHeader>
            <div className="py-4 text-gray-700 text-lg text-center">
              Mohon maaf jika banyak kesalahan dan kekurangan.<br />
              Semoga senang dan have fun!<br />
              <span className="text-2xl mt-2 block">🎉</span>
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() => setShowInfo(false)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg shadow transition-all duration-200"
              >
                Mengerti
              </button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Navigation */}
        <div className="text-center">
          <Button 
            onClick={onNavigateToHomepage}
            variant="outline"
            className="font-bold py-4 px-8 text-lg rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 border-0 flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
