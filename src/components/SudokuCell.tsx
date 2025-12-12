import { cn } from '@/lib/utils';
import { CellData } from '@/lib/sudoku';

interface SudokuCellProps {
  cell: CellData;
  row: number;
  col: number;
  isSelected: boolean;
  isHighlighted: boolean;
  isSolving: boolean;
  onClick: () => void;
}

export function SudokuCell({
  cell,
  row,
  col,
  isSelected,
  isHighlighted,
  isSolving,
  onClick,
}: SudokuCellProps) {
  // Determine border styles for 3x3 subgrid separation
  const isRightBorder = col === 2 || col === 5;
  const isBottomBorder = row === 2 || row === 5;
  const isTopEdge = row === 0;
  const isLeftEdge = col === 0;

  return (
    <button
      type="button"
      disabled={cell.isFixed || isSolving}
      onClick={onClick}
      className={cn(
        // Base styles
        'aspect-square w-full flex items-center justify-center',
        'text-lg sm:text-xl md:text-2xl font-bold',
        'transition-all duration-150 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
        
        // Background states
        isSelected && 'bg-cell-selected',
        !isSelected && isHighlighted && 'bg-cell-highlight',
        !isSelected && !isHighlighted && 'bg-card',
        
        // Error state
        cell.hasError && 'cell-error-flash bg-cell-error',
        
        // Solving animation
        isSolving && !cell.isFixed && cell.value > 0 && 'cell-solve-animation',
        
        // Text colors
        cell.isFixed ? 'text-cell-fixed' : 'text-cell-user',
        
        // Disabled state
        cell.isFixed && 'cursor-default',
        !cell.isFixed && !isSolving && 'cursor-pointer hover:bg-cell-highlight',
        
        // Border styles
        'border border-grid-border',
        isRightBorder && 'border-r-2 border-r-grid-subgrid',
        isBottomBorder && 'border-b-2 border-b-grid-subgrid',
        isTopEdge && 'border-t-2 border-t-grid-subgrid',
        isLeftEdge && 'border-l-2 border-l-grid-subgrid',
        
        // Corner rounding
        row === 0 && col === 0 && 'rounded-tl-lg',
        row === 0 && col === 8 && 'rounded-tr-lg',
        row === 8 && col === 0 && 'rounded-bl-lg',
        row === 8 && col === 8 && 'rounded-br-lg',
      )}
    >
      {cell.value > 0 ? cell.value : ''}
    </button>
  );
}
