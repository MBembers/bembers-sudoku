import "./App.css";
import Tile from "./Tile";
import React, { useState } from "react";
import * as emptyBoard from "./data/helpers.json";
import Game from "./Game";

function App() {
  const [board, setBoard] = useState(new Array(81).fill(new Tile()));
  const game = new Game(board, setBoard);
  console.log(board);
  let renderBoard = () => {
    return board.map((tile, i) => {
      return (
        <div
          className={`tile correct-${tile.correct} 
          solved-${tile.solved} 
          selected-${tile.selected}`}
          key={i}
        >
          {tile.number}
        </div>
      );
    });
  };
  return (
    <div className="main">
      <div className="panel panel-left"></div>
      <div className="center">
        <div className="board">{renderBoard()}</div>
      </div>
      <div className="panel panel-right"></div>
    </div>
  );
}

export default App;

/*
Instrukcje
Projekt sudoku (svelte/react)

5pkt
    plansza-szachownica 9x9
    wartości wpisywane z klawiatury, akcentowanie kolorem dobrych i złych odpowiedzi
    możliwość przemieszczania się strzałkami, kasowania wcześniejszej wartości
    możliwość wydrukowania rozwiązanego zestawu sudoku - planszy z tym co wpisane - @media print
    responsywność

6pkt
    wczytanie zestawu sudoku z zewnętrznego pliku, tych wartości nie można edytować
    możliwość samodzielnego rozwiązania wczytanego zestawu *
    możliwość automatycznego rozwiązania wczytanego zestawu *
    możliwość ustawiania "hint" (urzytkownik (osoba korzystajaca ze strony) ustala co może znajdować się w danym polu), "erease"
    wyświetlanie informacji o tym jakie cyfry zostały jeszcze do wpisania
    możliwość zapisania aktualnego stanu gry do pliku

* rozpoznawanie sytuacji gdy zestaw jest nie rozwiązywalny
** inne technologie niż svelte uzgadniamy indywidualnie

W załączniku znajduje się przykładowy design aplikacji
*/
