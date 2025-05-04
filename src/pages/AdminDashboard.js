// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue, set } from "firebase/database";
import "../index.css";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    red: 0,
    white: 0,
    houses: [],
  });

  const handleAddScoreData = async () => {
    const initialScores = {
      red: 0,
      white: 0,
      houses: [
        { name: "West House", score: 0 },
        { name: "Village Girls", score: 0 },
        { name: "Village Boys", score: 0 },
        { name: "Dinning", score: 0 },
        { name: "East House", score: 0 },
        { name: "Steward Top", score: 0 },
        { name: "Steward Middle", score: 0 },
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
      if (data) setData(data);
    });
  }, []);

  const openModal = () => {
    if (!data) return;
    setForm({
      red: data.red,
      white: data.white,
      houses: structuredClone(data.houses), // 원본 순서 유지
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSave = async () => {
    const updatedHouses = form.houses.map((house) => {
      const original = data.houses.find((h) => h.name === house.name);
      const oldScore = original ? original.score : 0;
      const diff = house.score - oldScore;
      return diff !== 0 ? { ...house, lastChangedAmount: diff } : house;
    });

    try {
      await set(ref(db, "scores"), {
        red: form.red,
        white: form.white,
        houses: updatedHouses,
        updatedDate: new Date().toISOString(),
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error updating scores:", error);
    }
  };

  const handleHouseChange = (index, value) => {
    const updatedHouses = [...form.houses];
    updatedHouses[index].score = Number(value);
    setForm({ ...form, houses: updatedHouses });
  };

  const handleTeamChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (!data) {
    return (
      <div className="container">
        <h2>Admin Dashboard</h2>
        <p>No score data available.</p>
        <button onClick={handleAddScoreData}>Add Score Document</button>
      </div>
    );
  }

  const redScore = data.red;
  const whiteScore = data.white;
  const sortedHouses = data.houses.slice().sort((a, b) => b.score - a.score);
  const half = Math.ceil(sortedHouses.length / 2);
  const leftColumn = sortedHouses.slice(0, half);
  const rightColumn = sortedHouses.slice(half);

  return (
    <div className="container">
      <div className="midtitleBox">
        <div className="subHeading">ADMIN DASHBOARD</div>
        <button className="edit-button" onClick={openModal} title="Edit Scores">
          Edit
        </button>
      </div>
      <div className="score-boxes">
        <div className="score-box red">
          <div className="scoreTitle">RED</div>
          <span className="score">{redScore}</span>
        </div>
        <div className="score-box white">
          <div className="scoreTitle">WHITE</div>
          <span className="score">{whiteScore}</span>
        </div>
      </div>
      <div className="midtitleDIV">
        <div className="subHeading">MORTY CUP</div>
      </div>
      <div className="houses-container">
        <div className="houses-columns">
          <div className="house-col">
            {leftColumn.map((house, idx) => (
              <div className="house-item" key={house.name}>
                <div
                  className={`house-rank rank-${idx + 1}`}
                  style={{ backgroundColor: house.color, color: house.fontColor }}
                >
                  {idx + 1}
                </div>
                <div className="house-name-wrapper">
                  <span className="house-name">{house.name}</span>
                </div>
                <div className="house-score">{house.score}</div>
              </div>
            ))}
          </div>
          <div className="house-col">
            {rightColumn.map((house, idx) => (
              <div className="house-item" key={house.name}>
                <div
                  className={`house-rank rank-${idx + half + 1}`}
                  style={{ backgroundColor: house.color, color: house.fontColor }}
                >
                  {idx + half + 1}
                </div>
                <div className="house-name-wrapper">
                  <span className="house-name">{house.name}</span>
                </div>
                <div className="house-score">{house.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="popup-overlay" onClick={closeModal}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Scores</h3>
            <div className="modal-form">
              <label>
                Red:
                <input type="number" name="red" value={form.red} onChange={handleTeamChange} />
              </label>
              <label>
                White:
                <input type="number" name="white" value={form.white} onChange={handleTeamChange} />
              </label>
              <h4>House Scores</h4>
              {form.houses.map((house, idx) => (
                <div key={idx} className="house-edit-row">
                  <label>{house.name}:</label>
                  <input
                    type="number"
                    value={house.score}
                    onChange={(e) => handleHouseChange(idx, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="modal-buttons">
              <button onClick={closeModal} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleSave} className="save-btn">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;