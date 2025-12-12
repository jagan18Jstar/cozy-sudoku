// Sudoku game logic - ported from C algorithm

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CellData {
  value: number; // 0 means empty
  isFixed: boolean;
  hasError: boolean;
}

export type Board = CellData[][];

// Difficulty settings - how many cells to remove
const DIFFICULTY_REMOVALS: Record<Difficulty, number> = {
  easy: 20,
  medium: 40,
  hard: 55,
};

// Check if placing num at board[row][col] is safe
export function isSafe(board: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) {
      return false;
    }
  }

  // Check 3x3 subgrid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }

  return true;
}

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fill a 3x3 diagonal box with random numbers
function fillDiagonalBox(board: number[][], boxRow: number, boxCol: number): void {
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let idx = 0;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[boxRow + i][boxCol + j] = nums[idx++];
    }
  }
}

// Backtracking solver - fills in remaining cells
function solveSudoku(board: number[][]): boolean {
  // Find empty cell
  let row = -1;
  let col = -1;
  let isEmpty = false;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        row = i;
        col = j;
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) break;
  }

  // No empty cell found - puzzle solved
  if (!isEmpty) {
    return true;
  }

  // Try numbers 1-9 in random order for variety
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  
  for (const num of nums) {
    if (isSafe(board, row, col, num)) {
      board[row][col] = num;
      
      if (solveSudoku(board)) {
        return true;
      }
      
      board[row][col] = 0; // Backtrack
    }
  }

  return false;
}

// Generate a complete valid Sudoku board using diagonal filling method
function generateCompleteBoard(): number[][] {
  const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));

  // Fill the three diagonal 3x3 boxes (they don't affect each other)
  fillDiagonalBox(board, 0, 0);
  fillDiagonalBox(board, 3, 3);
  fillDiagonalBox(board, 6, 6);

  // Solve the rest using backtracking
  solveSudoku(board);

  return board;
}

// Generate a puzzle by removing numbers from a complete board
export function generatePuzzle(difficulty: Difficulty): Board {
  const completeBoard = generateCompleteBoard();
  const removals = DIFFICULTY_REMOVALS[difficulty];
  
  // Create positions array and shuffle
  const positions: [number, number][] = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push([i, j]);
    }
  }
  
  const shuffledPositions = shuffle(positions);
  
  // Convert to CellData format
  const board: Board = completeBoard.map(row => 
    row.map(value => ({
      value,
      isFixed: true,
      hasError: false,
    }))
  );

  // Remove specified number of cells
  for (let i = 0; i < removals && i < shuffledPositions.length; i++) {
    const [row, col] = shuffledPositions[i];
    board[row][col].value = 0;
    board[row][col].isFixed = false;
  }

  return board;
}

// Check if placing num at position is valid for the current board state
export function isValidMove(board: Board, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (x !== col && board[row][x].value === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (x !== row && board[x][col].value === num) {
      return false;
    }
  }

  // Check 3x3 subgrid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const r = startRow + i;
      const c = startCol + j;
      if (r !== row || c !== col) {
        if (board[r][c].value === num) {
          return false;
        }
      }
    }
  }

  return true;
}

// Check if the puzzle is complete and valid
export function isPuzzleComplete(board: Board): boolean {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j].value === 0 || board[i][j].hasError) {
        return false;
      }
    }
  }
  return true;
}

// Solve the puzzle using backtracking - returns solution or null
export function solvePuzzle(board: Board): Board | null {
  // Create a simple number grid for solving
  const grid: number[][] = board.map(row => row.map(cell => cell.value));
  
  if (solveSudoku(grid)) {
    // Convert back to Board format, preserving isFixed
    return grid.map((row, i) => 
      row.map((value, j) => ({
        value,
        isFixed: board[i][j].isFixed,
        hasError: false,
      }))
    );
  }
  
  return null;
}

// Get cells to solve one by one for animation
export function getEmptyCells(board: Board): [number, number][] {
  const cells: [number, number][] = [];
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!board[i][j].isFixed && board[i][j].value === 0) {
        cells.push([i, j]);
      }
    }
  }
  
  return cells;
}

// Deep clone the board
export function cloneBoard(board: Board): Board {
  return board.map(row => row.map(cell => ({ ...cell })));
}

// Clear only user inputs
export function clearUserInputs(board: Board): Board {
  return board.map(row => 
    row.map(cell => ({
      ...cell,
      value: cell.isFixed ? cell.value : 0,
      hasError: false,
    }))
  );
}
