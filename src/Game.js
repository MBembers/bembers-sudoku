export default class Game {
  board;
  setBoard;
  selected;
  hinting = false;
  constructor(board, setBoard) {
    this.board = board;
    this.setBoard = setBoard;
    this.hinting = false;
    this.selected = -1;
    this.setupControls();
  }

  setupControls() {}
}

export function handleClick(e) {
  console.log(e.key);
  if (e.key === "ArrowRight" && this.selected < this.board.length - 1)
    this.selected++;
  else if (e.key === "ArrowLeft" && this.selected > 0) this.selected--;
  else if (e.key === "ArrowUp" && this.selected > 8) this.selected -= 9;
  else if (e.key === "ArrowDown" && this.selected < 72) this.selected += 9;
  for (let i = 0; i < this.board.length; i++) {
    this.board[i].selected = this.selected === i;
  }

  this.setBoard(this.board);
}
