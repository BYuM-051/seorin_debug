import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";
import RollingNumber from "../components/RollingNumber";
import { ClipLoader } from "react-spinners";

export default function MobileHistory(){

    const [records, setRecords] = useState([]);
    const [redWins, setRedWins] = useState(0);
    const [whiteWins, setWhiteWins] = useState(0);
    const [loading, setLoading] = useState(true);

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
        setLoading(false);
    });
  }, []);

  if(loading) {
    return(
      <div className="loadingScreen">
        Now Loading.. <ClipLoader size={40} color="#3498db"/>
    </div>
    );
  }

  return (
    <div className="container">
        <div className="subHeading">History of Winners</div>
        <div className="score-boxes">
            <div className="score-box red">
                <div className="scoreTitle">RED</div>
                <RollingNumber className="score" key = {redWins} target = {redWins} digitClass="score-digit"/>
            </div>
            <div className="score-box white">
                <div className="scoreTitle">WHITE</div>
                <RollingNumber className="score" key = {whiteWins} target = {whiteWins} digitClass="score-digit"/>
            </div>
        </div>
        <div className="mobileVerticalBlank"> </div>
        <div className="history-container">
            {
                records.map((record, idx) => (
                    <div className="history-card" key={record.id}>
                        <div className="history-cell year">{record.year}</div>
                        <div className="history-cell team">{record.team}</div>
                        <div className="history-cell house">{record.house}</div>
                    </div>
                ))
            }
        </div>
        <div className="mobileVerticalBlank"> </div>
    </div>

  );
}