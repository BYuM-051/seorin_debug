// src/pages/AdminHistory.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue, set } from "firebase/database";
import "../index.css";

function AdminHistory() {
  const [records, setRecords] = useState([]);
  const [redWins, setRedWins] = useState(0);
  const [whiteWins, setWhiteWins] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editRecord, setEditRecord] = useState({ year: "", team: "", house: "" });

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

  return (
    <div className="container">
      <h2>History of Winners!</h2>
      <div className="history-stats">
        <div className="history-stat-box redish">{redWins} times</div>
        <div className="history-stat-box whiteish">{whiteWins} times</div>
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
          {records.map((record) => {
            const isEditing = editingId === record.id;
            return (
              <tr key={record.id}>
                <td>
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
                </td>
                <td>
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
                </td>
                <td>
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
                </td>
                <td>
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
                    </select>
                  ) : (
                    record.house
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminHistory;
