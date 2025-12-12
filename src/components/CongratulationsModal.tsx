import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Difficulty } from '@/lib/sudoku';
import { Trophy, Sparkles } from 'lucide-react';
import teddyMascot from '@/assets/teddy-mascot.png';

interface CongratulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: (difficulty: Difficulty) => void;
  difficulty: Difficulty;
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export function CongratulationsModal({
  isOpen,
  onClose,
  onNewGame,
  difficulty,
}: CongratulationsModalProps) {
  // Trigger confetti when modal opens
  useEffect(() => {
    if (isOpen) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#6366f1', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444'],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#6366f1', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444'],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center bg-card border-2 border-primary/20 shadow-soft-lg">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img
                src={teddyMascot}
                alt="Teddy bear celebrating"
                className="w-24 h-24 floating-teddy"
              />
              <Trophy className="absolute -top-2 -right-2 w-8 h-8 text-amber-500 animate-bounce-soft" />
            </div>
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground">
            🎉 Congratulations! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <p className="text-lg text-muted-foreground">
            You solved the <span className="font-semibold text-primary">{difficultyLabels[difficulty]}</span> puzzle!
          </p>
          <p className="text-muted-foreground">
            Amazing job! Ready for another challenge?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            onClick={() => onNewGame(difficulty)}
            className="gap-2 shadow-soft"
          >
            <Sparkles className="w-4 h-4" />
            Play Again
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="shadow-soft"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
