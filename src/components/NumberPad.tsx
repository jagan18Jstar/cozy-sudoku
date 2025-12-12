import { cn } from '@/lib/utils';
import { Eraser } from 'lucide-react';

interface NumberPadProps {
  onNumberSelect: (num: number) => void;
  onClear: () => void;
  disabled: boolean;
}

export function NumberPad({ onNumberSelect, onClear, disabled }: NumberPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="w-full max-w-sm mx-auto animate-fade-in">
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {numbers.map((num) => (
          <button
            key={num}
            type="button"
            disabled={disabled}
            onClick={() => onNumberSelect(num)}
            className={cn(
              'number-pad-enter',
              'aspect-square rounded-xl',
              'bg-card shadow-soft border border-border',
              'text-xl sm:text-2xl font-bold text-foreground',
              'transition-all duration-150',
              'hover:bg-secondary hover:shadow-soft-lg hover:-translate-y-0.5',
              'active:translate-y-0 active:shadow-inner-soft',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
            )}
            style={{ animationDelay: `${num * 20}ms` }}
          >
            {num}
          </button>
        ))}
        <button
          type="button"
          disabled={disabled}
          onClick={onClear}
          className={cn(
            'number-pad-enter',
            'aspect-square rounded-xl',
            'bg-destructive/10 border border-destructive/30',
            'text-destructive',
            'transition-all duration-150',
            'hover:bg-destructive/20 hover:shadow-soft-lg hover:-translate-y-0.5',
            'active:translate-y-0 active:shadow-inner-soft',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
            'flex items-center justify-center',
          )}
          style={{ animationDelay: '200ms' }}
          aria-label="Clear cell"
        >
          <Eraser className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
