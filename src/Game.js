import SudokuSolver from "./SudokuSolver";
export function checkForIncorrect(board, index) {
  const choices = SudokuSolver.getChoices(board, index, false);
  console.log(index, choices);
  return choices.includes(board[index]);
}
