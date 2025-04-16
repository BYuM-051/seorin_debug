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

  return (
    <div className="container">
      <h2>History of Winners!</h2>
      <div className="score-boxes">
        <div className="score-box red">
          <span>{redWins}</span> 
          <div>times</div>
        </div>
        <div className="score-box white">
          <span>{whiteWins}</span> 
          <div>times</div>
        </div>
      </div>

      <div className="history-lists">
        {records.map((record, idx) => (
          <div className="history-list" key={idx}>
            <div className="history-cell year">{record.year}</div>
            <div>|</div>
            <div className="history-cell team">{record.team}</div>
            <div>|</div>
            <div className="history-cell house">{record.house}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
