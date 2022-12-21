import "./App.css";
import Tile from "./Tile";
import React, { useState, useEffect } from "react";
import { checkForIncorrect } from "./Game";
import SudokuSolver from "./SudokuSolver";

function App() {
  const [board, setBoard] = useState(new Array(81).fill(new Tile()));
  const [selected, setSelected] = useState(1);
  const [hinting, setHinting] = useState(false);

  let b = JSON.parse(JSON.stringify(board));

  let numsB = b.map((t) => t.number);

  const nums = Array(10).fill(0);
  board.forEach((tile) => {
    nums[tile.number]++;
  });

  const downloadFile = () => {
    const str = board.map((t) => t.number).join("");
    const file = new Blob([str], { type: "text/plain" });
    const a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = "sudoku-szablon";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const loadFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (readerEvent) => {
        const content = readerEvent.target.result;
        let newB = [];
        for (let num of content) {
          let number = parseInt(num);
          newB.push(new Tile(number, true));
        }
        let newNumsB = b.map((t) => t.number);
        let newIsValid = SudokuSolver.isValid(newNumsB);
        if (!newIsValid) {
          alert("Wczytana plansza jest nieprawidłowa, włączono edycję.");
          newB.forEach((t) => {
            t.solid = false;
          });
        }
        setBoard(newB);

        input.remove();
      };
    };

    input.click();
  };

  const checkValid = () => {
    const isValid = SudokuSolver.isValid(numsB);
    if (!isValid) {
      alert("Wczytana plansza jest nieprawidłowa.");
      setBoard(board);
    } else {
      alert("Plansza poprawna");
    }
  };

  const solve = () => {
    const solver = new SudokuSolver();
    const solution = solver.solveForUnique(numsB);
    if (solution[1] !== "ok") {
      alert(solution[1]);
      return;
    }
    const solved = solution[0];
    for (let index = 0; index < solved.length; index++) {
      b[index].number = solved[index];
    }
    setBoard(b);
  };

  useEffect(() => {
    const handleClick = (e) => {
      let s = selected;
      if (e.key === " ") {
        setHinting(!hinting);
        return;
      }
      if (e.key === "Backspace" && !b[s].solid) {
        b[s].number = 0;
        b[s].hints = [];
      }
      if ("123456789".includes(e.key) && !b[s].solid) {
        const num = parseInt(e.key);
        if (hinting) {
          b[s].num = 0;
          if (b[s].hints.includes(num))
            b[s].hints = b[s].hints.filter((h) => h != num);
          else b[s].hints.push(num);
        } else {
          b[s].hints = [];
          b[s].number = num;
        }
        // win(b);
      }
      if (e.key === "ArrowRight" && s < b.length - 1) {
        s++;
      } else if (e.key === "ArrowLeft" && s > 0) {
        s--;
      } else if (e.key === "ArrowUp" && s > 8) s -= 9;
      else if (e.key === "ArrowDown" && s < 72) s += 9;
      setSelected(s);
      setBoard(b);
    };
    document.addEventListener("keydown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleClick);
    };
  }, [selected, b, hinting]);

  const win = (b) => {
    const nums2 = Array(10).fill(0);
    b.forEach((tile) => {
      nums2[tile.number]++;
    });

    let finished = true;
    for (let k = 1; k < nums2.length; k++) {
      if (nums2[k] < 9) {
        finished = false;
      }
    }
    if (finished) window.print();
  };

  return (
    <div className="main">
      <div className="panel panel-left">
        <button onClick={downloadFile}>Pobierz plik z planszą</button>
        <button onClick={loadFile}>Załaduj planszę z pliku</button>
        <button onClick={checkValid}>Sprawdź poprawność planszy</button>
        <button onClick={solve}>Wypełnij sudoku</button>
        <button
          onClick={() => {
            window.print();
          }}
        >
          Wydrukuj planszę
        </button>
      </div>
      <div className="center">
        <div className="board">
          {board.map((tile, i) => {
            return (
              <div
                className={`tile correct-${checkForIncorrect(numsB, i)} 
          solved-${tile.solved} 
          selected-${i === selected}
          solid-${tile.solid}`}
                key={i + "t"}
                onClick={() => setSelected(i)}
              >
                {tile.hints.length > 0
                  ? tile.hints.sort().map((h) => (
                      <span className="hint" key={h + "h"}>
                        {h}
                      </span>
                    ))
                  : tile.number !== 0
                  ? tile.number
                  : ""}
              </div>
            );
          })}
        </div>
      </div>
      <div className="panel panel-right">
        <button onClick={() => setHinting(!hinting)}>
          {hinting ? "Tryb podpowiedzi" : "Tryb normalny"}
        </button>
        <div className="nums-table">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
            return (
              <div
                className={`num-cell ${nums[n] > 8 ? "num-all" : ""}`}
                key={n + "n"}
              >
                {n}
              </div>
            );
          })}
        </div>
      </div>
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
