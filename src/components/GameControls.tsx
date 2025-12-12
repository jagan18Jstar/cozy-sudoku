import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Difficulty } from '@/lib/sudoku';
import { Sparkles, RotateCcw, Wand2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameControlsProps {
  currentDifficulty: Difficulty;
  onNewGame: (difficulty: Difficulty) => void;
  onAutoSolve: () => void;
  onReset: () => void;
  isSolving: boolean;
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const difficultyColors: Record<Difficulty, string> = {
  easy: 'text-success',
  medium: 'text-accent',
  hard: 'text-destructive',
};

export function GameControls({
  currentDifficulty,
  onNewGame,
  onAutoSolve,
  onReset,
  isSolving,
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in">
      {/* New Game Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="lg"
            disabled={isSolving}
            className="gap-2 shadow-soft hover:shadow-soft-lg transition-shadow"
          >
            <Sparkles className="w-4 h-4" />
            New Game
            <ChevronDown className="w-4 h-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="min-w-[140px]">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
            <DropdownMenuItem
              key={diff}
              onClick={() => onNewGame(diff)}
              className={cn(
                'cursor-pointer font-medium',
                difficultyColors[diff],
              )}
            >
              {difficultyLabels[diff]}
              {diff === currentDifficulty && (
                <span className="ml-2 text-muted-foreground">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Auto Solve */}
      <Button
        variant="secondary"
        size="lg"
        onClick={onAutoSolve}
        disabled={isSolving}
        className="gap-2 shadow-soft hover:shadow-soft-lg transition-shadow"
      >
        <Wand2 className="w-4 h-4" />
        {isSolving ? 'Solving...' : 'Auto Solve'}
      </Button>

      {/* Reset */}
      <Button
        variant="outline"
        size="lg"
        onClick={onReset}
        disabled={isSolving}
        className="gap-2 shadow-soft hover:shadow-soft-lg transition-shadow"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>
    </div>
  );
}
