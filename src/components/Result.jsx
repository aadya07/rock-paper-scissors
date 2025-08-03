import React from "react";
import stone from "../assets/stone_img.png";
import scissor from "../assets/scissor_img.png";
import paper from "../assets/paper_img.png";

const choiceImages = {
  Rock: stone,
  Paper: paper,
  Scissors: scissor,
};

export default function Result({ result, game, player1, player2, move1, move2, handleNextRound, handleEndGame }) {
    if (!game) return null;
  return (
    <div className="result-container">
      
      {/* ✅ Result message */}
      <h3 className="result-message">{result.message}</h3>

      {/* ✅ Left-Right cards */}
      <div className="result-choices">
        {/* Player 1 */}
        <div className="player-choice-card">
          <img src={choiceImages[move1]} alt={move1} className="result-img" />
          <p className="player-name blue">{player1}</p>
        </div>

        {/* Player 2 */}
        <div className="player-choice-card">
          <img src={choiceImages[move2]} alt={move2} className="result-img" />
          <p className="player-name yellow">{player2}</p>
        </div>
      </div>

      {/* ✅ Buttons */}
      <div className="result-buttons">
        <button onClick={handleNextRound} className="choice-btn">Play Again</button>
        <button onClick={handleEndGame} className="choice-btn">End Game</button>
      </div>
    </div>
  );
}
