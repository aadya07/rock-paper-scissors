import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import Leaderboard from "./Leaderboard";

export default function Lobby() {
  const {
    currentUser,
    updatePlayers,
    updateGame,
    players,
    game,
    updateWaitingList,
    setCurrentUser,
    scores,
    updateScores,
  } = useContext(GameContext);

  const navigate = useNavigate();

  // Redirect to home if no user
  useEffect(() => {
    const savedUser = sessionStorage.getItem("currentUser");
    if (!currentUser && !savedUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Load username from sessionStorage
  useEffect(() => {
    const savedUser = sessionStorage.getItem("currentUser");
    if (!currentUser && savedUser) {
      setCurrentUser(savedUser);
    } else if (currentUser) {
      sessionStorage.setItem("currentUser", currentUser);
    }
  }, [currentUser, setCurrentUser]);

  // Auto-navigate to game if user is in an ongoing game
  useEffect(() => {
    if (game && (game.player1 === currentUser || game.player2 === currentUser)) {
      navigate("/game");
    }
  }, [game, currentUser, navigate]);

  // Handle tab close or refresh
  useEffect(() => {
    const handleTabClose = () => {
      if (!currentUser) return;

      // Remove currentUser from players
      const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
      const updatedPlayers = storedPlayers.filter((p) => p !== currentUser);
      localStorage.setItem("players", JSON.stringify(updatedPlayers));
      updatePlayers(updatedPlayers);

      // Remove currentUser from scores
      const storedScores = JSON.parse(localStorage.getItem("scores")) || {};
      if (storedScores[currentUser]) {
        delete storedScores[currentUser];
        localStorage.setItem("scores", JSON.stringify(storedScores));
        updateScores(storedScores);
      }

      // If user was in ongoing game, end it
      const storedGame = JSON.parse(localStorage.getItem("game"));
      if (storedGame && (storedGame.player1 === currentUser || storedGame.player2 === currentUser)) {
        localStorage.removeItem("game");
        updateGame(null);
      }

      // Remove from waitingList if present
      const storedWaiting = JSON.parse(localStorage.getItem("waitingList")) || [];
      const updatedWaiting = storedWaiting.filter((p) => p !== currentUser);
      localStorage.setItem("waitingList", JSON.stringify(updatedWaiting));
      updateWaitingList(updatedWaiting);

      // Clear sessionStorage
      sessionStorage.removeItem("currentUser");
    };

    window.addEventListener("beforeunload", handleTabClose);
    return () => window.removeEventListener("beforeunload", handleTabClose);
  }, [currentUser, updatePlayers, updateGame, updateWaitingList, updateScores]);

  // Start a new game
  const handlePlay = (opponent) => {
    if (game && ![game.player1, game.player2].includes(currentUser)) {
      alert("Another game is in progress! Wait for it to finish.");
      return;
    }

    const newGame = {
      player1: currentUser,
      player2: opponent,
      moves: {},
      result: null,
    };
    updateGame(newGame);
  };

  // Exit lobby
  const handleExit = () => {
    const updatedPlayers = players.filter((p) => p !== currentUser);
    updatePlayers(updatedPlayers);

    // Remove currentUser from scores on exit
    const updatedScores = { ...scores };
    if (updatedScores[currentUser]) {
      delete updatedScores[currentUser];
      localStorage.setItem("scores", JSON.stringify(updatedScores));
      updateScores(updatedScores);
    }

    sessionStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="lobby-container">
      <button className="exit-button" onClick={handleExit}>Exit →</button>

      <div className="lobby-heading">
        Welcome, <span className="username">{currentUser}</span> !!
      </div>

      <div className={`game-status ${game ? "ongoing" : "available"}`}>
        {game ? "Game is going on!!" : "You can now start the game"}
      </div>

      <div className="lobby-subheading">🔥 Active Players 🔥</div>

      <ul className="players-grid">
        {players.map((player) => (
          <li key={player} className="player-card">
            {player === currentUser ? (
              <span className="you">{player} (You)</span>
            ) : (
              <>
                {player}{" "}
                <button onClick={() => handlePlay(player)}>Play</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <Leaderboard />
    </div>
  );
}
