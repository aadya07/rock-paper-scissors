import React, { useContext, useState, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import Result from "./Result";   // ✅ Import the new component
import stone from "../assets/stone_img.png";
import scissor from "../assets/scissor_img.png";
import { useNavigate } from "react-router-dom";
import paper from "../assets/paper_img.png";

const choices = [
  { name: "Rock", img: stone },
  { name: "Paper", img: paper },
  { name: "Scissors", img: scissor },
];

export default function Game() {
  const {
    currentUser,
    game,
    updateGame,
    scores,
    updateScores,
    updateWaitingList,
  } = useContext(GameContext);

  const [selected, setSelected] = useState("");

  useEffect(() => {
    setSelected("");
  }, [game]);

  const navigate = useNavigate(); // ✅ inside the component

  if (!game) {
    return (
      <div className="game-container">
        <h2 className="text-white">Game has ended or not started yet!</h2>
        <button className="back-lobby-btn" onClick={() => navigate("/lobby")}>
          Go Back to Lobby
        </button>
      </div>
    );
  }

  const handleMove = (choice) => {
    const newGame = { ...game, moves: { ...game.moves, [currentUser]: choice } };
    updateGame(newGame);
    setSelected(choice);
    console.log("Moves:", moves);


    const moves = newGame.moves;
    if (moves[newGame.player1] && moves[newGame.player2]) {
      const result = calculateWinner(
        moves[newGame.player1],
        moves[newGame.player2],
        newGame.player1,
        newGame.player2
      );
      newGame.result = result;
      updateGame(newGame);

      const newScores = { ...scores };
      if (result.winner) {
        newScores[result.winner] = (newScores[result.winner] || 0) + 1;
        updateScores(newScores);
      }
    }
  };

  const calculateWinner = (move1, move2, player1, player2) => {
    if (move1 === move2) return { winner: null, message: "It's a Draw!" };

    const winRules = {
      Rock: "Scissors",
      Scissors: "Paper",
      Paper: "Rock",
    };

    if (winRules[move1] === move2) {
      return { winner: player1, message: `${player1} Wins!` };
    } else {
      return { winner: player2, message: `${player2} Wins!` };
    }
  };

  const handleNextRound = () => {
    const newGame = {
      player1: game.player1,
      player2: game.player2,
      moves: {},
      result: null,
    };
    updateGame(newGame);
  };

  const handleEndGame = () => {
    updateGame(null);

    if (window.confirm("End game? This will allow next players to join.")) {
      const waiting = JSON.parse(localStorage.getItem("waitingList")) || [];
      if (waiting.length >= 1) {
        const nextPlayer = waiting[0];
        updateWaitingList(waiting.slice(1));

        const availableOpponent =
          currentUser === game.player1 ? game.player2 : game.player1;

        const newGame = {
          player1: nextPlayer,
          player2: availableOpponent,
          moves: {},
          result: null,
        };
        updateGame(newGame);
      }
    }
  };

  const handleExitGame = () => {
    if (window.confirm("Are you sure you want to exit the game?")) {
      updateGame(null);
    }
  };

  return (
    <div className="game-container">
      {/* ✅ Heading */}
      <div className="game-heading">
        <span className="player-name">{game.player1}</span>
        <span className="vs-text"> VS </span>
        <span className="player-name">{game.player2}</span>
      </div>

      {/* ✅ Exit Button */}
      <div className="exit-btn-container">
        <button className="exit-btn" onClick={handleExitGame}>
          Exit Game
        </button>
      </div>

      {/* ✅ Only show this when result is NOT displayed */}
      {!game.result && (
        <p className="text-white">
          Your choice: {game.moves[currentUser] || selected || "None"}
        </p>
      )}

      {/* ✅ Choices */}
      {!game.moves[currentUser] && !game.result && (
        <div className="choices">
          {choices.map((choice) => (
            <div key={choice.name} className="choice-card">
              <img src={choice.img} alt={choice.name} className="choice-img" />
              <button
                className="choice-btn"
                onClick={() => handleMove(choice.name)}
              >
                {choice.name}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Use Result component */}
      {game.result && (
        <Result
          result={game.result}
          player1={game.player1}
          player2={game.player2}
          move1={game.moves[game.player1]}
          move2={game.moves[game.player2]}
          handleNextRound={handleNextRound}
          handleEndGame={handleEndGame}
        />
      )}
    </div>
  );
}
