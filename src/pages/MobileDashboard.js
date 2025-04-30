import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue, set } from "firebase/database";
import "../mobile.css";
import RollingNumber from "../components/RollingNumber";
import { ClipLoader } from "react-spinners";
import { FaTrophy } from "react-icons/fa";

export default function MobileDashboard() {
    const [scoreData, setScoreData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [noScore, setNoScore] = useState(false);

    useEffect( ()=> {
        const scoresRef = ref(db, "scores");
        const unsubscribe = onValue(scoresRef, (snapshot) => {
            const data = snapshot.val();

            if(!data){
                setNoScore(true);
                setScoreData(null);
                setLoading(false);
                return;
            }

            setScoreData(data);
            setLoading(false);
        });

        return() => unsubscribe;
    }, []);

    if(loading) {
        return (
        <div className="loadingScreen">
            Now Loading... <ClipLoader size={40} color="#3498db"/>
        </div>
    );}
    const houses = scoreData.houses || [];
    const redScore = scoreData.red;
    const whiteScore = scoreData.white;
    const sortedHouses = houses.slice().sort((a, b) => b.score - a.score);

    return(
        <div className="container">
            <div className="lastUpdateDate">Last Update : {scoreData.updatedDate ? new Date(scoreData.updatedDate).toLocaleString() : " No date available"}</div>
            <div className="mobileVerticalBlank"> </div>
            <div className="subHeading">Color Competition</div>
            <div className="score-boxes">
                <div className="score-box red">
                    <div className="scoreTitle">RED</div>
                    <RollingNumber className="score" key = {redScore} target = {redScore} digitClass="score-digit"/>
                </div>
                <div className="score-box white">
                    <div className="scoreTitle">WHITE</div>
                    <RollingNumber className="score" key = {whiteScore} target = {whiteScore} digitClass="score-digit"/>
                </div>
            </div>

            <div className="mobileVerticalBlank"> </div>

            <div className="subHeading">Morty Cup</div>
            <div className="houses-container"></div>
                {
                    sortedHouses.map((house, idx) => {
                        const rank = idx + 1;
                        return (
                            <div className="house-item">
                                <div className={`house-rank rank-${rank}`} style={{backgroundColor:house.color, color:house.fontColor}}>{rank}</div>
                                <div className="house-name-wrapper">
                                    <span className="house-name">{house.name}</span>
                                    {rank <= 3 && (
                                    <FaTrophy className={`trophy trophyrank-${rank}`} />
                                    )}
                                </div>
                                <div className="house-lastupdated-score" style={house.lastChangedAmount > 0 ? {color:"green"} : {color:"red"}}>
                                    ({house.lastChangedAmount > 0 ? "+" : "" }{house.lastChangedAmount})
                                </div>
                                <RollingNumber
                                    className="house-score"
                                    digitClass="house-digit"
                                    key={`${house.name}-${house.score}`}
                                    target={house.score}
                                />
                            </div>
                        );
                    })
                }
        
        </div>
    );
}