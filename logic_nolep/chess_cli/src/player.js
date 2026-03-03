export class Player {
  constructor(name, isWhite) {
    this._name = name;     
    this._isWhite = isWhite; 
  }

  get name() {
    return this._name;
  }

  get isWhite() {
    return this._isWhite; 
  }
}
