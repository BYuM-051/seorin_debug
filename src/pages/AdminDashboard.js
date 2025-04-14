// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue, set } from "firebase/database";
import "../index.css";

const redDorms = ["West House", "Village Girls", "Village Boys", "Dinning"];
const whiteDorms = ["East House", "Steward Top", "Steward Middle"]

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    red: 0,
    white: 0,
    houses: [],
  });

  // Function to add initial score document
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

  // Read scores from Realtime Database
  useEffect(() => {
    const scoresRef = ref(db, "scores");
    onValue(scoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setData(data);
      }
    });
  }, []);

  // Compute team totals from houses array
  const computeTotals = (houses) => {
    let redTotal = 0;
    let whiteTotal = 0;
    houses.forEach((house) => {
      if (redDorms.includes(house.name)) {
        redTotal += Number(house.score);
      } else {
        whiteTotal += Number(house.score);
      }
    });
    return { redTotal, whiteTotal };
  };

  const currentHouses = showModal ? form.houses : data?.houses || [];
  const { redTotal, whiteTotal } = computeTotals(currentHouses);

  // Open modal with current data
  const openModal = () => {
    if (!data) return;
    const sortedHouses = data.houses ? data.houses.slice().sort((a, b) => b.score - a.score) : [];
    setForm({
      red: redTotal,
      white: whiteTotal,
      houses: sortedHouses,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Save changes to Realtime Database
  const handleSave = async () => {
    try {
      await set(ref(db, "scores"), {
        red: form.red,
        white: form.white,
        houses: form.houses,
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

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
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
      <div className="updated-date" style={{ textAlign: "right" }}>
        <button className="edit-button" onClick={openModal} title="Edit Scores">
          ✏️
        </button>
      </div>
      <h3>Current Winning House</h3>
      <div className="houses-container">
        {data.houses &&
          data.houses.map((house, idx) => (
            <div key={idx} className="house-item">
              <div className="house-rank">{idx + 1}</div>
              <div className="house-name">{house.name}</div>
              <div className="house-score">{house.score}</div>
            </div>
          ))}
      </div>

      {showModal && (
        <div className="popup-overlay">
          <div className="popup-content">
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
                  <input type="number" value={house.score} onChange={(e) => handleHouseChange(idx, e.target.value)} />
                </div>
              ))}
            </div>
            <div className="modal-buttons">
              <button onClick={closeModal} className="cancel-btn">Cancel</button>
              <button onClick={handleSave} className="save-btn">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
