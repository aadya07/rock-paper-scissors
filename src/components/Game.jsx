import React, { useContext, useState, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import stone from "../assets/stone_img.png";
import scissor from "../assets/scissor_img.png";
import { useNavigate } from "react-router-dom";
import paper from "../assets/paper_img.png";

const choices = [
  { name: "Rock", img: stone },
  { name: "Paper", img: paper },
  { name: "Scissors", img: scissor },
];

const choiceImages = {
  Rock: stone,
  Paper: paper,
  Scissors: scissor,
};

export default function Game() {
  const {
    currentUser,
    game,
    updateGame,
    updatePlayers,
    players,
    scores,
    updateScores,
    updateWaitingList,
  } = useContext(GameContext);

  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = sessionStorage.getItem("currentUser");
    if (!currentUser && !savedUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);


  useEffect(() => {
    setSelected("");
  }, [game]);

  useEffect(() => {
    const handleTabClose = () => {
      if (!currentUser) return;

      // Remove player from players list
      const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
      const updatedPlayers = storedPlayers.filter((p) => p !== currentUser);
      localStorage.setItem("players", JSON.stringify(updatedPlayers));
      updatePlayers(updatedPlayers);

      // End game for both players if ongoing
      const storedGame = JSON.parse(localStorage.getItem("game"));
      if (storedGame && (storedGame.player1 === currentUser || storedGame.player2 === currentUser)) {
        localStorage.removeItem("game");
        updateGame(null);
      }

      // Remove from waiting list if present
      const storedWaiting = JSON.parse(localStorage.getItem("waitingList")) || [];
      const updatedWaiting = storedWaiting.filter((p) => p !== currentUser);
      localStorage.setItem("waitingList", JSON.stringify(updatedWaiting));
      updateWaitingList(updatedWaiting);

      // Clear session user
      sessionStorage.removeItem("currentUser");
    };

    window.addEventListener("beforeunload", handleTabClose);
    return () => window.removeEventListener("beforeunload", handleTabClose);
  }, [currentUser, updatePlayers, updateGame, updateWaitingList]);

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
    updateGame({ ...newGame });
    setSelected(choice);

    const moves = newGame.moves;
    if (moves[newGame.player1] && moves[newGame.player2]) {
      const result = calculateWinner(
        moves[newGame.player1],
        moves[newGame.player2],
        newGame.player1,
        newGame.player2
      );

      const updatedGame = { ...newGame, result };
      updateGame(updatedGame);

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

    (window.confirm("This will END the game.")) 
  };

  const handleExit = () => {
    const updatedPlayers = players.filter((p) => p !== currentUser);
    updatePlayers(updatedPlayers);
    sessionStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="game-container">
      <button className="exit-button" onClick={handleExit}>Exit →</button>

      <div className="game-heading">
        <span
          className={`player-name ${currentUser === game.player1 ? "current-user" : ""}`}
        >
          {game.player1}
        </span>
        <span className="vs-text"> VS </span>
        <span
          className={`player-name ${currentUser === game.player2 ? "current-user" : ""}`}
        >
          {game.player2}
        </span>
      </div>

      {!game.result && (
        <div className="choices">
          {game.moves[currentUser] || selected ? (
            <div className="choice-card selected-card">
              <img
                src={choiceImages[game.moves[currentUser] || selected]}
                alt={game.moves[currentUser] || selected}
                className="choice-img"
              />
              <p className="selected-text">
                You chose: {game.moves[currentUser] || selected}
              </p>
              <p className="text-white">Your opponent is yet to choose!</p>
            </div>
          ) : (
            choices.map((choice) => (
              <div key={choice.name} className="choice-card">
                <img src={choice.img} alt={choice.name} className="choice-img" />
                <button
                  className="choice-btn"
                  onClick={() => handleMove(choice.name)}
                >
                  {choice.name}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {game.result && (
        <div className="result-container">
          <h3 className="result-message">{game.result.message}</h3>

          <div className="result-choices">
            <div className="player-choice-card">
              <img
                src={choiceImages[game.moves[game.player1]]}
                alt={game.moves[game.player1]}
                className="result-img"
              />
              <p className="player-name blue">{game.player1}</p>
            </div>

            <div className="player-choice-card">
              <img
                src={choiceImages[game.moves[game.player2]]}
                alt={game.moves[game.player2]}
                className="result-img"
              />
              <p className="player-name yellow">{game.player2}</p>
            </div>
          </div>

          <div className="result-buttons">
            <button onClick={handleNextRound} className="choice-btn">
              Play Again
            </button>
            <button onClick={handleEndGame} className="choice-btn">
              End Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
