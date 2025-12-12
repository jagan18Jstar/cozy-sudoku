import { useState, useEffect, useCallback, useRef } from 'react';
import { SudokuBoard } from './SudokuBoard';
import { NumberPad } from './NumberPad';
import { GameControls } from './GameControls';
import { CongratulationsModal } from './CongratulationsModal';
import {
  Board,
  Difficulty,
  generatePuzzle,
  isValidMove,
  isPuzzleComplete,
  solvePuzzle,
  clearUserInputs,
  cloneBoard,
  getEmptyCells,
} from '@/lib/sudoku';
import teddyMascot from '@/assets/teddy-mascot.png';

export function SudokuGame() {
  const [board, setBoard] = useState<Board>(() => generatePuzzle('easy'));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [showCongrats, setShowCongrats] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [solvingCell, setSolvingCell] = useState<[number, number] | null>(null);
  const solveTimeoutRef = useRef<number | null>(null);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSolving) return;

      // Number keys 1-9
      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key, 10));
        return;
      }

      // Clear with backspace or delete
      if (e.key === 'Backspace' || e.key === 'Delete') {
        handleClear();
        return;
      }

      // Arrow key navigation
      if (selectedCell && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const [row, col] = selectedCell;
        let newRow = row;
        let newCol = col;

        switch (e.key) {
          case 'ArrowUp':
            newRow = Math.max(0, row - 1);
            break;
          case 'ArrowDown':
            newRow = Math.min(8, row + 1);
            break;
          case 'ArrowLeft':
            newCol = Math.max(0, col - 1);
            break;
          case 'ArrowRight':
            newCol = Math.min(8, col + 1);
            break;
        }

        setSelectedCell([newRow, newCol]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, board, isSolving]);

  // Cleanup solve timeout on unmount
  useEffect(() => {
    return () => {
      if (solveTimeoutRef.current) {
        clearTimeout(solveTimeoutRef.current);
      }
    };
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (isSolving) return;
    setSelectedCell([row, col]);
  }, [isSolving]);

  const handleNumberInput = useCallback((num: number) => {
    if (!selectedCell || isSolving) return;
    
    const [row, col] = selectedCell;
    if (board[row][col].isFixed) return;

    setBoard((prev) => {
      const newBoard = cloneBoard(prev);
      newBoard[row][col].value = num;
      newBoard[row][col].hasError = !isValidMove(newBoard, row, col, num);

      // Clear error after animation
      if (newBoard[row][col].hasError) {
        setTimeout(() => {
          setBoard((current) => {
            const updated = cloneBoard(current);
            updated[row][col].hasError = false;
            return updated;
          });
        }, 500);
      }

      return newBoard;
    });
  }, [selectedCell, board, isSolving]);

  const handleClear = useCallback(() => {
    if (!selectedCell || isSolving) return;

    const [row, col] = selectedCell;
    if (board[row][col].isFixed) return;

    setBoard((prev) => {
      const newBoard = cloneBoard(prev);
      newBoard[row][col].value = 0;
      newBoard[row][col].hasError = false;
      return newBoard;
    });
  }, [selectedCell, board, isSolving]);

  // Check for completion
  useEffect(() => {
    if (!isSolving && isPuzzleComplete(board)) {
      setShowCongrats(true);
    }
  }, [board, isSolving]);

  const handleNewGame = useCallback((newDifficulty: Difficulty) => {
    if (solveTimeoutRef.current) {
      clearTimeout(solveTimeoutRef.current);
    }
    setIsSolving(false);
    setSolvingCell(null);
    setShowCongrats(false);
    setDifficulty(newDifficulty);
    setBoard(generatePuzzle(newDifficulty));
    setSelectedCell(null);
  }, []);

  const handleReset = useCallback(() => {
    if (solveTimeoutRef.current) {
      clearTimeout(solveTimeoutRef.current);
    }
    setIsSolving(false);
    setSolvingCell(null);
    setBoard((prev) => clearUserInputs(prev));
    setSelectedCell(null);
  }, []);

  const handleAutoSolve = useCallback(() => {
    const solution = solvePuzzle(board);
    if (!solution) return;

    setIsSolving(true);
    setSelectedCell(null);

    const emptyCells = getEmptyCells(board);
    let currentIndex = 0;

    const solveNext = () => {
      if (currentIndex >= emptyCells.length) {
        setIsSolving(false);
        setSolvingCell(null);
        setBoard(solution);
        return;
      }

      const [row, col] = emptyCells[currentIndex];
      setSolvingCell([row, col]);

      setBoard((prev) => {
        const newBoard = cloneBoard(prev);
        newBoard[row][col].value = solution[row][col].value;
        return newBoard;
      });

      currentIndex++;
      solveTimeoutRef.current = window.setTimeout(solveNext, 50);
    };

    solveNext();
  }, [board]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img
            src={teddyMascot}
            alt="Teddy mascot"
            className="w-12 h-12 floating-teddy"
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Sudoku
          </h1>
        </div>
        <p className="text-muted-foreground">
          Fill in the grid so every row, column, and 3×3 box contains 1-9
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 pb-8 gap-6">
        {/* Game Controls */}
        <GameControls
          currentDifficulty={difficulty}
          onNewGame={handleNewGame}
          onAutoSolve={handleAutoSolve}
          onReset={handleReset}
          isSolving={isSolving}
        />

        {/* Difficulty Badge */}
        <div className="text-sm font-medium text-muted-foreground">
          Playing: <span className="text-primary capitalize">{difficulty}</span>
        </div>

        {/* Sudoku Board */}
        <SudokuBoard
          board={board}
          selectedCell={selectedCell}
          solvingCell={solvingCell}
          onCellClick={handleCellClick}
        />

        {/* Number Pad */}
        <div className="w-full px-4">
          <NumberPad
            onNumberSelect={handleNumberInput}
            onClear={handleClear}
            disabled={!selectedCell || board[selectedCell[0]]?.[selectedCell[1]]?.isFixed || isSolving}
          />
        </div>

        {/* Keyboard hints for desktop */}
        <p className="text-xs text-muted-foreground text-center hidden sm:block">
          Use keyboard: 1-9 to enter, Backspace to clear, Arrow keys to navigate
        </p>
      </main>

      {/* Footer with small teddy decorations */}
      <footer className="px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <img src={teddyMascot} alt="" className="w-5 h-5 opacity-60" />
          <span>Made with ❤️</span>
          <img src={teddyMascot} alt="" className="w-5 h-5 opacity-60 scale-x-[-1]" />
        </div>
      </footer>

      {/* Congratulations Modal */}
      <CongratulationsModal
        isOpen={showCongrats}
        onClose={() => setShowCongrats(false)}
        onNewGame={handleNewGame}
        difficulty={difficulty}
      />
    </div>
  );
}
