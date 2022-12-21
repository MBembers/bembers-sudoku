import SudokuSolver from "./SudokuSolver";
export function checkForIncorrect(board, index) {
  const choices = SudokuSolver.getChoices(board, index, false);
  return choices.includes(board[index]);
}
