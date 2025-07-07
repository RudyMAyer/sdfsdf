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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Silahkan input namamu 'U' "
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border rounded px-3 py-2"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Login
          </button>
        </form>
        {log && <div className="mt-4 text-green-700 text-center">{log}</div>}
      </div>
    </div>
  );
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
