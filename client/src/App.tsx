import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { Homepage } from "./pages/homepage";
import { LevelSelection } from "./pages/level-selection";
import { Gameplay } from "./pages/gameplay";
import NotFound from "@/pages/not-found";

function Router() {
  const [currentView, setCurrentView] = useState<'homepage' | 'level-selection' | 'gameplay'>('homepage');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  const navigateToHomepage = () => setCurrentView('homepage');
  const navigateToLevelSelect = () => setCurrentView('level-selection');
  const navigateToGameplay = (level: number) => {
    setSelectedLevel(level);
    setCurrentView('gameplay');
  };

  return (
    <Switch>
      <Route path="/">
        <div className="game-container min-h-screen">
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
