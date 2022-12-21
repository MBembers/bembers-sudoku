const MAX_ITERATIONS = 1e7;

export default class SudokuSolver {
  constructor() {
    this.iterations = 0;
  }

  static i2rc(index) {
    return { row: Math.floor(index / 9), col: index % 9 };
  }

  static rc2i(row, col) {
    return row * 9 + col;
  }

  static acceptable(board, index, value) {
    let { row, col } = SudokuSolver.i2rc(index);
    for (let r = 0; r < 9; ++r) {
      if (SudokuSolver.rc2i(r, col) === index) continue;
      if (board[SudokuSolver.rc2i(r, col)] === value) return false;
    }
    for (let c = 0; c < 9; ++c) {
      if (SudokuSolver.rc2i(row, c) === index) continue;
      if (board[SudokuSolver.rc2i(row, c)] === value) return false;
    }
    let r1 = Math.floor(row / 3) * 3;
    let c1 = Math.floor(col / 3) * 3;
    for (let r = r1; r < r1 + 3; ++r) {
      for (let c = c1; c < c1 + 3; ++c) {
        if (SudokuSolver.rc2i(r, c) === index) continue;
        if (board[SudokuSolver.rc2i(r, c)] === value) return false;
      }
    }
    return true;
  }

  static getChoices(board, index, backwards) {
    let choices = [];
    for (let value = 1; value <= 9; ++value) {
      if (SudokuSolver.acceptable(board, index, value)) {
        choices.push(value);
      }
    }
    if (backwards) choices.reverse();
    return choices;
  }

  static isValid(board) {
    for (let i = 0; i < 81; i++) {
      if (!board[i]) continue;
      if (!SudokuSolver.getChoices(board, i, false).includes(board[i]))
        return false;
    }
    return true;
  }

  solve(index, board, backwards) {
    this.iterations++;
    if (this.iterations > MAX_ITERATIONS) {
      return true;
    }
    while (index < 81 && board[index]) ++index;
    if (index === 81) return true;
    let moves = SudokuSolver.getChoices(board, index, backwards);
    for (let m of moves) {
      board[index] = m;
      if (this.solve(index + 1, board, backwards)) return true;
    }
    board[index] = 0;
    return false;
  }

  solveForUnique(board) {
    if (!SudokuSolver.isValid(board))
      return [new Array(81).fill(0), "board not valid"];
    this.iterations = 0;
    let solve1 = JSON.parse(JSON.stringify(board));
    this.solve(0, solve1, false, 0);
    if (this.iterations > MAX_ITERATIONS) {
      return [new Array(81).fill(0), "no solutions"];
    }
    this.iterations *= -1;
    let solve2 = JSON.parse(JSON.stringify(board));
    this.solve(0, solve2, true, 0);
    if (solve1.every((x, i) => x === solve2[i])) return [solve1, "ok"];
    return [new Array(81).fill(0), "sudoku should have only 1 solution"];
  }
}
