import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { Homepage } from "./pages/homepage";
import { LevelSelection } from "./pages/level-selection";
import { Gameplay } from "./pages/gameplay";
import NotFound from "@/pages/not-found";

function Login({ onLogin }: { onLogin: (username: string) => void }) {
  const [username, setUsername] = useState("");
  const [log, setLog] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("username");
    if (saved) {
      setLog(`Logged in as: ${saved}`);
      setUsername(saved);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem("username", username.trim());
      setLog(`Logged in as: ${username.trim()}`);
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-700 via-white to-black transition-all duration-500 overflow-hidden relative">
      <EmojiBackground />
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 max-w-sm w-full border border-blue-100 relative transform transition-transform duration-200 hover:scale-105 hover:shadow-3xl z-10">
        <div className="flex justify-center mb-4">
          <span className="inline-block bg-blue-600 text-white rounded-full p-3 shadow-lg animate-bounce-slow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
            </svg>
          </span>
        </div>
        <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-700 drop-shadow">Login</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Masuk untuk melanjutkan ke TTS Explorer. Nama kamu akan tampil di papan skor!</p>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            placeholder="Silahkan input namamu 'U' "
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border-2 border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg shadow-sm hover:border-blue-500 bg-white/80 backdrop-blur placeholder-gray-400"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 via-blue-400 to-black hover:from-blue-800 hover:to-gray-900 text-white font-bold py-3 px-4 rounded-lg text-lg shadow-lg transition-all duration-200 tracking-wide"
          >
            Login
          </button>
        </form>
        {log && <div className="mt-6 text-green-700 text-center font-semibold animate-fade-in-up">{log}</div>}
      </div>
    </div>
  );
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const EMOJIS = [
  "🚀", "🎉", "🧩", "🤖", "🌟", "🦄", "🎲", "🧠", "💡", "📚", "🎮", "🕹️", "✨", "🦉", "🧸", "🍀", "🌈", "🪐", "🦕", "🦋"
];

function EmojiBackground() {
  // Generate 14 random emojis with random positions and sizes
  const emojis = Array.from({ length: 14 }).map((_, i) => {
    const emoji = EMOJIS[getRandomInt(0, EMOJIS.length - 1)];
    const top = getRandomInt(5, 85); // percent
    const left = getRandomInt(5, 85); // percent
    const size = getRandomInt(28, 64); // px
    const delay = getRandomInt(0, 20) / 10; // s
    return (
      <span
        key={i}
        style={{
          top: `${top}%`,
          left: `${left}%`,
          fontSize: `${size}px`,
          animationDelay: `${delay}s`,
          zIndex: 1,
        }}
        className="pointer-events-none select-none animate-emoji-pop absolute opacity-80"
      >
        {emoji}
      </span>
    );
  });
  return <>{emojis}</>;
}

function Router() {
  const [currentView, setCurrentView] = useState<'login' | 'homepage' | 'level-selection' | 'gameplay'>(
    localStorage.getItem("username") ? 'homepage' : 'login'
  );
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [username, setUsername] = useState<string | null>(localStorage.getItem("username"));

  const navigateToHomepage = () => setCurrentView('homepage');
  const navigateToLevelSelect = () => setCurrentView('level-selection');
  const navigateToGameplay = (level: number) => {
    setSelectedLevel(level);
    setCurrentView('gameplay');
  };
  const handleLogin = (uname: string) => {
    setUsername(uname);
    setCurrentView('homepage');
  };

  return (
    <Switch>
      <Route path="/">
        <div className="game-container min-h-screen">
          {currentView === 'login' && (
            <Login onLogin={handleLogin} />
          )}
          {currentView === 'homepage' && (
            <Homepage onNavigateToLevelSelect={navigateToLevelSelect} />
          )}
          {currentView === 'level-selection' && (
            <LevelSelection 
              onNavigateToHomepage={navigateToHomepage}
              onPlayLevel={navigateToGameplay}
            />
          )}
          {currentView === 'gameplay' && (
            <Gameplay 
              level={selectedLevel}
              onNavigateToLevelSelect={navigateToLevelSelect}
              onNavigateToGameplay={navigateToGameplay}
            />
          )}
        </div>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
