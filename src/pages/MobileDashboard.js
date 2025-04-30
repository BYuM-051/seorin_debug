import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue, set } from "firebase/database";
import "../mobile.css";
import RollingNumber from "../components/RollingNumber";
import { ClipLoader } from "react-spinners";

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
        return <ClipLoader size={40} color="#3498db"/>;
    }

    return(
        <>
        </>

    );
}