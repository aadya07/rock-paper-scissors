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
    waitingList,
    updateWaitingList,
    setCurrentUser,  // ✅ ensure setter is in context
  } = useContext(GameContext);

  const navigate = useNavigate();

  // ✅ Load from sessionStorage for this tab only
  useEffect(() => {
    const savedUser = sessionStorage.getItem("currentUser");
    if (!currentUser && savedUser) {
      setCurrentUser(savedUser);
    } else if (currentUser) {
      sessionStorage.setItem("currentUser", currentUser);
    }
  }, [currentUser, setCurrentUser]);

  const handlePlay = (opponent) => {
    if (game && ![game.player1, game.player2].includes(currentUser)) {
      if (!waitingList.includes(currentUser)) {
        updateWaitingList([...waitingList, currentUser]);
        alert("Another game is in progress! You've been added to the waiting list.");
      }
      return;
    }

    const newGame = {
      player1: currentUser,
      player2: opponent,
      moves: {},
      result: null,
    };
    updateGame(newGame);
    navigate("/game");
  };

  const handleExit = () => {
    const updatedPlayers = players.filter((p) => p !== currentUser);
    updatePlayers(updatedPlayers);
    sessionStorage.removeItem("currentUser"); // ✅ clear per tab
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
