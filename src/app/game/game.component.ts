import { NgSwitchDefault } from '@angular/common';
import { Component } from '@angular/core';

const icons = [
  'bomb',
  'pumpkin',
  'sweet-blue',
  'ghost',
  'skull',
  // 'sweet-green',
  // 'sweet-pink',
  // 'eye',
  // 'heart',
  // 'potion',
];

const NR_COLS = 6;
const NR_ROWS = 8;
const TIMEOUT = 500;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  public gameBoard: string[];
  private currentPoints: number;

  public get points(): number {
    return this.currentPoints;
  }

  constructor() {
    this.gameBoard = [];
    this.currentPoints = 0;
    this.fillGameBoard();
  }

  private fillGameBoard(): void {
    for (let i = 0; i < NR_ROWS * NR_COLS; i++) {
      this.gameBoard[i] = icons[Math.floor(Math.random() * icons.length)];
    }
  }

  public onIconClick(index: number): void {
    if (this.gameBoard[index] !== '' && this.gameBoard[index] !== 'disappear') {

      let disappearedIcons = this.checkNeighbours(Math.floor(index / NR_COLS), index % NR_COLS, this.gameBoard[index]);
      this.currentPoints += disappearedIcons * disappearedIcons;
      setTimeout(() => this.shift(), TIMEOUT);
    }
  }

  private checkNeighbours(row: number, col: number, icon: string): number {
    let index = row * NR_COLS + col;
    let disappeared = 0;
    if (this.gameBoard[index] === icon) {
      this.gameBoard[index] = '';
      disappeared++;
      if (row > 0) {
        disappeared += this.checkNeighbours(row - 1, col, icon);
      }
      if (row < NR_ROWS - 1) {
        disappeared += this.checkNeighbours(row + 1, col, icon);
      }
      if (col > 0) {
        disappeared += this.checkNeighbours(row, col - 1, icon);
      }
      if (col < NR_COLS - 1) {
        disappeared += this.checkNeighbours(row, col + 1, icon);
      }

      this.gameBoard[index] = 'disappear';
      setTimeout(() => this.gameBoard[index] = '', TIMEOUT);
    }
    return disappeared;
  }

  private shift() {
    for (let col = 0; col < NR_COLS; col++) {
      let empty: (number | undefined) = undefined;
      for (let row = NR_ROWS - 1; row >= 0; row--) {
        const content = this.gameBoard[row * NR_COLS + col];
        if (!content && !empty) {
          empty = row;
        } else if (empty && content) {
          this.gameBoard[empty * NR_COLS + col] = content;
          this.gameBoard[row * NR_COLS + col] = '';
          empty--;
        }
      }
    }
  }
}
