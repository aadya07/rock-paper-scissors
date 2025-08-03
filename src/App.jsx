import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Lobby from "./components/Lobby";
import Game from "./components/Game";
import { GameContext } from "./context/GameContext";
import { useContext } from "react";

export default function App() {
  const { currentUser, game } = useContext(GameContext);

  return (
    <div className="app-wrapper">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </div>
  );
}
