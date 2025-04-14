// src/pages/History.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue, push } from "firebase/database";
import "../index.css";

function History() {
  const [records, setRecords] = useState([]);
  const [redWins, setRedWins] = useState(0);
  const [whiteWins, setWhiteWins] = useState(0);

  useEffect(() => {
    const historyRef = ref(db, "history");
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const historyArray = Object.entries(data).map(([id, item]) =>
           ({ id, ...item }));
        historyArray.sort((a, b) => b.year - a.year);
        setRecords(historyArray);
        setRedWins(historyArray.filter((r) => r.team === "RED").length);
        setWhiteWins(historyArray.filter((r) => r.team === "WHITE").length);
      }
    });
  }, []);

  const handleAddSampleHistory = async () => {
    const sampleRecord = {
      year: new Date().getFullYear(),
      team: Math.random() > 0.5 ? "RED" : "WHITE",
      house: ["West House", "Village Girls", "Village Boys", "Dinning"]
      [Math.floor(Math.random() * 4)]
    };

    try {
      await push(ref(db, "history"), sampleRecord);
      alert("Sample history record added!");
    } catch (error) {
      console.error("Error adding sample history record:", error);
    }
  };

  return (
    <div className="container">
      <h2>History of Winners!</h2>
      <div className="history-stats">
        <div className="history-stat-box redish">{redWins} times</div>
        <div className="history-stat-box whiteish">{whiteWins} times</div>
      </div>
      <div style={{ textAlign: "left", marginBottom: "1rem" }}>
        <button onClick={handleAddSampleHistory}
         style={{ backgroundColor: "orange" }}>
          Add Sample History
        </button>
      </div>
      <table className="history-list">
        <thead>
          <tr>
            <th style={{ width: "40px" }}></th>
            <th>Year</th>
            <th>Team</th>
            <th>Dormitory</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, idx) => (
            <tr key={idx}>
              <td></td>
              <td>{record.year}</td>
              <td>{record.team}</td>
              <td>{record.house}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;
