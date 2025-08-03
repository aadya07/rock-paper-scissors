import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";

export default function Leaderboard() {
  const { scores, players } = useContext(GameContext);

  const activeScores = Object.entries(scores)
    .filter(([player]) => players.includes(player)) // only active players
    .sort((a, b) => b[1] - a[1]); // sort descending

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-heading">Leaderboard</div>
      {activeScores.length === 0 ? (
        <p className="text-white">No scores yet</p>
      ) : (
        <ul className="text-white">
          {activeScores.map(([player, score], index) => (
            <li key={player}>
              <strong>{index + 1}. {player}</strong> - {score} pts
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
