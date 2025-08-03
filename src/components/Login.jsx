import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import gameHands from "../assets/gameHands_img.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { setCurrentUser, players, updatePlayers } = useContext(GameContext);
  const navigate = useNavigate();

  // When players update, save to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  // On app load, restore players
  useEffect(() => {
    const savedPlayers = JSON.parse(sessionStorage.getItem("players")) || [];
    updatePlayers(savedPlayers);
  }, []);

  const handleLogin = () => {
    if (!username.trim()) {
      setError("Username cannot be empty!");
      return;
    }

    if (players.includes(username)) {
      setError("Username already taken!");
      return;
    }

    // Add user to players
    const updatedPlayers = [...players, username];
    updatePlayers(updatedPlayers);

    setCurrentUser(username);
    setError("");
    navigate("/lobby");
  };

  return (
    <div className="login-container">
      <div className="login-heading">Welcome to Rock-Paper-Scissors !!!</div>
      <div className="login-img">
        <img 
          className="login-hands-image"
          src={gameHands} 
          alt="Rock Paper Scissors Hands"
        /> 
      </div>
      <div className="login-entry">
        <input
          type="text"
          placeholder="Enter unique username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleLogin}>Join Game</button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
