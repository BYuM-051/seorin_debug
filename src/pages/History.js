// src/pages/History.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";
import "../index.css";
import RollingNumber from "../components/RollingNumber";

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
      <div className="subHeading">History of Winners</div>
      <div className="score-boxes">
        <div className="score-box red">
          <RollingNumber className="score" key={redWins} target={redWins}>{redWins}</RollingNumber>
          <div className="scoreTitle">times</div>
        </div>
        <div className="score-box white">
          <RollingNumber className="score" key={whiteWins} target={whiteWins}>{whiteWins}</RollingNumber> 
          <div className="scoreTitle">times</div>
        </div>
      </div>

      <div className="history-lists">
        {records.map((record, idx) => (
          <div className="history-list" key={record.id}>
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
