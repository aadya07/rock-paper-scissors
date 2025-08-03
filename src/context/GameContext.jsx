import React, { createContext, useState, useEffect } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [game, setGame] = useState(null); // { player1, player2, moves, result }
  const [waitingList, setWaitingList] = useState([]);

  // ✅ Sync state with localStorage
  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
    const storedScores = JSON.parse(localStorage.getItem("scores")) || {};
    const storedGame = JSON.parse(localStorage.getItem("game")) || null;
    const storedWaiting = JSON.parse(localStorage.getItem("waitingList")) || [];

    setPlayers(storedPlayers);
    setScores(storedScores);
    setGame(storedGame);
    setWaitingList(storedWaiting);
  }, []);

  // ✅ Listen for updates from other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setPlayers(JSON.parse(localStorage.getItem("players")) || []);
      setScores(JSON.parse(localStorage.getItem("scores")) || {});
      setGame(JSON.parse(localStorage.getItem("game")) || null);
      setWaitingList(JSON.parse(localStorage.getItem("waitingList")) || []);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Helper to update localStorage whenever state changes
  const updatePlayers = (newPlayers) => {
    setPlayers(newPlayers);
    localStorage.setItem("players", JSON.stringify(newPlayers));
  };

  const updateScores = (newScores) => {
    setScores(newScores);
    localStorage.setItem("scores", JSON.stringify(newScores));
  };

  const updateGame = (newGame) => {
    setGame(newGame);
    localStorage.setItem("game", JSON.stringify(newGame));
  };

  const updateWaitingList = (list) => {
    setWaitingList(list);
    localStorage.setItem("waitingList", JSON.stringify(list));
  };

  return (
    <GameContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        players,
        updatePlayers,
        scores,
        updateScores,
        game,
        updateGame,
        waitingList,
        updateWaitingList,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
