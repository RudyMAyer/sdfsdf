"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import type { GameStats } from "@shared/schema"
import { useState } from "react"
import { InstructionsModal } from "../components/instructions-modal"
import { Play, HelpCircle, RotateCcw, Trophy, Target, Sparkles, Instagram } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { apiRequest } from "../lib/queryClient";

interface HomepageProps {
  onNavigateToLevelSelect: () => void
}

export function Homepage({ onNavigateToLevelSelect }: HomepageProps) {
  const [showInstructions, setShowInstructions] = useState(false)
  const [showResetProgressModal, setShowResetProgressModal] = useState(false)

  const { data: gameStats } = useQuery<GameStats>({
    queryKey: ["/api/game-stats/1"],
  })

  // Fungsi reset progress ke backend
  async function resetProgress() {
    try {
      await apiRequest('POST', '/api/reset-progress', { userId: 1 });
    } catch (e) {
      // Bisa tambahkan notifikasi error jika mau
    } finally {
      localStorage.clear();
      window.location.reload();
    }
  }

  // Kalimat dan simbol random
  const funMessages = [
    "Selamat datang di TTS Explorer! Siap menantang otakmu hari ini?",
    "Ayo main TTS, siapa tahu jadi juara!",
    "Jangan lupa ngopi sebelum main biar makin jago!",
    "Semangat! Setiap kata adalah petualangan.",
    "Tebak kata, kumpulkan tawa!",
    "Main TTS, otak makin encer!",
    "Siap-siap, tantangan seru menantimu!",
    "Buktikan kamu master TTS sejati!",
    "Santai aja, yang penting happy!",
    "TTS Explorer: Tempatnya para penjelajah kata!"
  ];
  const funEmojis = ["🤩", "🚀", "🎉", "🧠", "🔥", "🎲", "🌟", "😎", "🦄", "✨", "🎮", "🥳", "🦉", "🍀", "🌈", "🪐"];
  const [randomMsg, setRandomMsg] = useState(funMessages[Math.floor(Math.random() * funMessages.length)]);
  const [randomEmoji, setRandomEmoji] = useState(funEmojis[Math.floor(Math.random() * funEmojis.length)]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" style={{animationDuration:'3s'}}></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" style={{animationDuration:'4s'}}></div>
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-br from-yellow-100 to-pink-100 rounded-full opacity-20 blur-2xl"></div>
        <svg className="absolute bottom-10 right-10 w-32 h-32 opacity-10" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="#6366f1" strokeWidth="4" strokeDasharray="8 8" /></svg>
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          {/* Logo/Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl shadow-2xl mb-6 animate-bounce-slow">
            <Sparkles className="w-14 h-14 text-white animate-spin-slow" />
          </div>

          {/* Title and Subtitle */}
          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent mb-4 leading-tight drop-shadow-xl tracking-tight animate-fade-in-up">TTS Explorer</h1>
          <p className="text-2xl text-gray-700 mb-8 font-semibold animate-fade-in-up delay-100">Asah otak, kuasai kata, dan jadilah juara TTS modern!</p>
        </div>

        {/* Fun Random Message & Emoji */}
        <div className="flex flex-col items-center justify-center mb-10 animate-fade-in-up">
          <span className="text-7xl md:text-8xl mb-4 animate-bounce-slow drop-shadow-xl">{randomEmoji}</span>
          <div className="text-2xl md:text-3xl font-bold text-blue-700 text-center mb-2 drop-shadow-lg max-w-xl">{randomMsg}</div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 animate-fade-in-up delay-200">
          <Button
            onClick={onNavigateToLevelSelect}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-7 px-10 text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.04] transition-all duration-200 border-0 flex items-center justify-center gap-3"
          >
            <Play className="w-7 h-7 mr-3 animate-pulse" />
            Mulai Bermain
          </Button>

          <Button
            onClick={() => setShowInstructions(true)}
            variant="outline"
            size="lg"
            className="w-full font-bold py-6 px-10 shadow-xl hover:shadow-2xl bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300 transform hover:scale-[1.03] transition-all duration-200 flex items-center justify-center gap-3"
          >
            <HelpCircle className="w-7 h-7 mr-3 text-blue-500" />
            Cara Bermain
          </Button>

          <Button
            onClick={() => setShowResetProgressModal(true)}
            variant="outline"
            size="lg"
            className="w-full font-bold py-6 px-10 shadow-xl hover:shadow-2xl bg-white/80 backdrop-blur-sm border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transform hover:scale-[1.03] transition-all duration-200 flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-7 h-7 mr-3 text-red-500" />
            Reset Progress
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center animate-fade-in-up delay-300">
          <p className="text-base text-gray-500 font-medium mb-2">Challenge your mind • Build your vocabulary • Have fun</p>
          <div className="flex justify-center items-center gap-2 mt-4">
            <a
              href="https://www.instagram.com/rudymayer.fr?igsh=aTh1NDNlY3NydWE="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-700 font-semibold text-sm transition-colors"
            >
              <Instagram className="w-5 h-5" />
              Ikuti di Instagram: <span className="font-bold">@rudymayer.fr</span>
              <span className="ml-1 px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full font-bold border border-pink-200">Official</span>
            </a>
          </div>
          <div className="mt-4 text-xs text-gray-400">&copy; {new Date().getFullYear()} TTS Explorer. All rights reserved.</div>
        </div>
      </div>

      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
      {/* Reset Progress Modal */}
      <Dialog open={showResetProgressModal} onOpenChange={setShowResetProgressModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Progress</DialogTitle>
          </DialogHeader>
          <div className="mb-4 text-gray-700">Yakin ingin me-reset seluruh progres? Semua skor dan level akan dihapus.</div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowResetProgressModal(false)}>Batal</Button>
            <Button variant="destructive" onClick={() => { setShowResetProgressModal(false); resetProgress(); }}>Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}