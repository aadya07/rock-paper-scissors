import React from "react";
import { useNavigate } from "react-router-dom";
import allHands from "../assets/allHands.png"

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="glass-container">
        <div className="title">
          <div className="title-text">
            <span>ROCK</span>
            <span>PAPER</span>
            <span>SCISSORS</span>
          </div>
          <div className="title-image">
            <img 
                className="hands-image"
                src={allHands} 
                alt="Rock Paper Scissors Hands"
                /> 
          </div>
        </div>
        <button className="play-button" onClick={() => navigate("/login")}>
          Let's Play
        </button>
      </div>
    </div>
  );
}
