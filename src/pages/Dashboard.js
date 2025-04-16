// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue, set } from "firebase/database";
import "../index.css";

const redDorms = ["West House", "Village Girls", "Village Boys", "Dinning"];

function Dashboard() {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noScore, setNoScore] = useState(false);

  // Function to add initial score data if none exists
  const handleAddScoreData = async () => {
    const initialScores = {
      red: 0,
      white: 0,
      houses: [
        { name: "West House", score: 0 },
        { name: "Village Girls", score: 0 },
        { name: "Village Boys", score: 0 },
        { name: "Dinning", score: 0 }
      ],
      updatedDate: new Date().toISOString(),
    };
    try {
      await set(ref(db, "scores"), initialScores);
    } catch (error) {
      console.error("Error adding score data:", error);
    }
  };

  useEffect(() => {
    const scoresRef = ref(db, "scores");
    onValue(scoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setScoreData(data);
        setNoScore(false);
      } else {
        setNoScore(true);
        setScoreData(null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="container">Loading dashboard data...</div>;
  }

  if (noScore || !scoreData) {
    return (
      <div className="container">
        <h2>Scoreboard</h2>
        <p>No score data available.</p>
        <button onClick={handleAddScoreData}>Add Score Document</button>
      </div>
    );
  }

  // Calculate team totals
  const houses = scoreData.houses || [];
  let redTotal = 0;
  let whiteTotal = 0;
  houses.forEach((house) => {
    if (redDorms.includes(house.name)) {
      redTotal += Number(house.score);
    } else {
      whiteTotal += Number(house.score);
    }
  });

  // Sort houses descending by score
  const sortedHouses = houses.slice().sort((a, b) => b.score - a.score);
  const half = Math.ceil(sortedHouses.length / 2);
  const leftColumn = sortedHouses.slice(0, half);
  const rightColumn = sortedHouses.slice(half);

  return (
    
    <div className="container">
      <h2 className = "subHeading">Color Competition</h2>
      <div className="score-boxes">
        <div className="score-box red">
          <h2>RED</h2>
          <div className="score">{redTotal}</div>
        </div>
        <div className="score-box white">
          <h2>WHITE</h2>
          <div className="score">{whiteTotal}</div>
        </div>
      </div>
      <div className="updated-date">
        Updated: {scoreData.updatedDate ? new Date(scoreData.updatedDate).toLocaleString() : "No date available"}
      </div>
      <h2 className = "subHeading">Morty Cup</h2>
      <div className="houses-container">
      <div className="houses-columns">
        <div className="house-col">
          {leftColumn.map((house, idx) => {
            const rank = idx + 1;
            return (
              <div className="house-item" key={rank}>
                <div className={`house-rank rank-${rank}`}>{rank}</div>
                <div className="house-name">{house.name}</div>
                <div className="house-score">{house.score}</div>
              </div>
            );
          })}
        </div>
        <div className="house-col">
          {rightColumn.map((house, idx) => {
            const rank = idx + half + 1;
            return (
              <div className="house-item" key={rank}>
                <div className={`house-rank rank-${rank}`}>{rank}</div>
                <div className="house-name">{house.name}</div>
                <div className="house-score">{house.score}</div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}

export default Dashboard;
