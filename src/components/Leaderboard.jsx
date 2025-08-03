import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";

export default function Leaderboard() {
  const { scores } = useContext(GameContext);

  // ✅ Convert scores object to sorted array
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-heading">Leaderboard</div>
      {sortedScores.length === 0 ? (
        <p className="text-white">No scores yet</p>
      ) : (
        <ul>
          {sortedScores.map(([player, score], index) => (
            <li key={player}>
              <strong>{index + 1}. {player}</strong> - {score} pts
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}