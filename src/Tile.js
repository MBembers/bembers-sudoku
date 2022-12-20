export default class Tile {
  hints = [];
  style = null;
  correct = null;
  number = 0;
  solid = false;
  constructor(number = 0, solid = false) {
    this.number = number;
    this.solid = solid && number > 0;
  }
}
