// src/pages/Dashboard.js
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue, set } from "firebase/database";
import "../index.css";
import RollingNumber from "../components/RollingNumber";
import { FaTrophy } from "react-icons/fa";

function Dashboard() {
  const [realScoreData, setRealScoreData] = useState(null);
  const [displayedScoreData, setDisplayedScoreData] = useState(null);
  const realScoreDataRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const [loading, setLoading] = useState(true);
  const [noScore, setNoScore] = useState(false);

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

      if (!data) {
        setNoScore(true);
        setRealScoreData(null);
        setLoading(false);
        return;
      }

      setLoading(false);

      if (!realScoreDataRef.current) {
        setRealScoreData(data);
        setDisplayedScoreData(data);
        realScoreDataRef.current = data;
        return;
      }

      if (JSON.stringify(data) !== JSON.stringify(realScoreDataRef.current)) {
        realScoreDataRef.current = data;
        setRealScoreData(data);
        setShowModal(true);
        setCountdown(3);
      
        setTimeout(() => {
          setShowModal(false);
          setDisplayedScoreData(data);

        }, 3000);
      }
    });
  }, []);

  useEffect(() => {
    if (!showModal) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 3;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showModal]);

  if (loading) {
    return <div className="container">Loading dashboard data...</div>;
  }

  if (noScore || !realScoreData || !displayedScoreData) {
    return (
      <div className="container">
        <h2>Scoreboard</h2>
        <p>No score data available.</p>
        <button onClick={handleAddScoreData}>Add Score Document</button>
      </div>
    );
  }

  const houses = displayedScoreData.houses || [];
  const redScore = displayedScoreData.red;
  const whiteScore = displayedScoreData.white;

  const sortedHouses = houses.slice().sort((a, b) => b.score - a.score);
  const half = Math.ceil(sortedHouses.length / 2);
  const leftColumn = sortedHouses.slice(0, half);
  const rightColumn = sortedHouses.slice(half);

  return (
    <>
      <div className="container">
        <div className="last-update-date">
          Last Update : {realScoreData.updatedDate ? new Date(realScoreData.updatedDate).toLocaleString() : "No date available"}
        </div>
        <div className="subHeading">Color Competition</div>
        <div className="score-boxes">
          <div className="score-box red">
            <div className="scoreTitle">RED</div>
            <RollingNumber className="score" key={redScore} target={redScore} digitClass="score-digit" />
          </div>
          <div className="score-box white">
            <div className="scoreTitle">WHITE</div>
            <RollingNumber className="score" key={whiteScore} target={whiteScore} digitClass="score-digit" />
          </div>
        </div>

        <div className="subHeading">Morty Cup</div>
        <div className="houses-container">
          <div className="houses-columns">
            <div className="house-col">
              {leftColumn.map((house, idx) => {
                const rank = idx + 1;
                return (
                  <div className="house-item">
                    <div className={`house-rank rank-${rank}`}>{rank}</div>
                    <div className="house-name-wrapper">
                      <span className="house-name">{house.name}</span>
                      {rank <= 3 && (
                        <FaTrophy className={`trophy trophyrank-${rank}`} />
                      )}
                    </div>
                    <RollingNumber
                      className="house-score"
                      digitClass="house-digit"
                      key={`${house.name}-${house.score}`}
                      target={house.score}
                    />
                  </div>
                );
              })}
            </div>
            <div className="house-col">
              {rightColumn.map((house, idx) => {
                const rank = idx + half + 1;
                return (
                  <div className="house-item" key={house.name}>
                    <div className={`house-rank rank-${rank}`}>{rank}</div>
                    <div className="house-name">{house.name}</div>
                    <RollingNumber
                      className="house-score"
                      digitClass="house-digit"
                      key={`${house.name}-${house.score}`}
                      target={house.score}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div>Score has been updated!</div>
            <div>{countdown}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;