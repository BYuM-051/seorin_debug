// src/pages/AdminHistory.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue, set, push } from "firebase/database";
import "../index.css";

function AdminHistory() {
  const [records, setRecords] = useState([]);
  const [redWins, setRedWins] = useState(0);
  const [whiteWins, setWhiteWins] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editRecord, setEditRecord] = useState({ year: "", team: "", house: "" });

  const redDorms = ["West House", "Village Girls", "Village Boys", "Dinning"];
  const whiteDorms = ["East House", "Steward Top", "Steward Middle"]

  useEffect(() => {
    const historyRef = ref(db, "history");
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const historyArray = Object.entries(data).map(([id, item]) => ({ id, ...item }));
        historyArray.sort((a, b) => b.year - a.year);
        setRecords(historyArray);
        setRedWins(historyArray.filter((r) => r.team === "RED").length);
        setWhiteWins(historyArray.filter((r) => r.team === "WHITE").length);
      }
    });
  }, []);

  const handleEditSave = async (id) => {
    try {
      await set(ref(db, `history/${id}`), editRecord);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const handleAddSampleHistory = async () => {
    const sampleRecord = {
      year: new Date().getFullYear(),
      team: "RED",
      house: "West House"
    };

    try {
      await push(ref(db, "history"), sampleRecord);
    } catch (error) {
      console.error("Error adding sample history record:", error);
    }

  };

  return (
    
    <div className="container">
      <div className="midtitleDIV">
        <h2>History of Winners!</h2>
        <button className="edit-button" onClick={handleAddSampleHistory}>
          Add
        </button>
      </div>
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
      
      <div className = "history-lists">
        {records.map((record) => {
          const isEditing = editingId === record.id;
          return (
            <div className="history-list-admin" key={record.id}>
              <div className="history-cell edit">
                {isEditing ? (
                  <>
                    <button onClick={() => handleEditSave(record.id)}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ marginLeft: "4px" }}>
                      X
                    </button>
                  </>
                ) : (
                  <button
                    className="edit-button"
                    onClick={() => {
                      setEditingId(record.id);
                      setEditRecord({
                        year: record.year,
                        team: record.team,
                        house: record.house,
                      });
                    }}
                    title="Edit record"
                  >
                    ✏️
                  </button>
                )}
              </div>
              <div>|</div>
              <div className="history-cell year">
                {isEditing ? (
                  <input
                    type="number"
                    value={editRecord.year}
                    onChange={(e) => setEditRecord({ ...editRecord, year: e.target.value })}
                    style={{ width: "80px" }}
                  />
                ) : (
                  record.year
                )}
              </div>
              <div>|</div>
              <div className = "history-cell team">
                {isEditing ? (
                  <select
                    value={editRecord.team}
                    onChange={(e) => setEditRecord({ ...editRecord, team: e.target.value })}
                  >
                    <option value="">Select Team</option>
                    <option value="RED">RED</option>
                    <option value="WHITE">WHITE</option>
                  </select>
                ) : (
                  record.team
                )}
              </div>
              <div>|</div>
              <div className="history-cell house">
                {isEditing ? (
                  <select
                    value={editRecord.house}
                    onChange={(e) => setEditRecord({ ...editRecord, house: e.target.value })}
                  >
                    <option value="">Select Dormitory</option>
                    <option value="West House">West House</option>
                    <option value="Village Girls">Village Girls</option>
                    <option value="Village Boys">Village Boys</option>
                    <option value="Dinning">Dinning</option>
                    <option value="East House">East House</option>
                    <option value="Steward Top">Steward Top</option>
                    <option value="Steward Middle">Steward Middle</option>
                  </select>
                ) : (
                  record.house
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminHistory;
