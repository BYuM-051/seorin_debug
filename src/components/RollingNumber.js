/*
Read me!!!----
this code was generated with chatGPT

how to use :

<RollingNumber target = {key}/>

-GYuN 0419 11:46
*/

import React, { useEffect, useState } from "react";
import "./RollingNumber.css";

// ===================
// 🔹 RollingDigit
// ===================

const RawRollingDigit = ({ digit, duration, delay }) => {
  const [digitList, setDigitList] = useState([digit]);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const loops = 4;
    const digits = [];

    for (let i = 0; i < loops * 10; i++) {
      digits.push(i % 10);
    }
    digits.push(digit);

    setDigitList(digits);
    setTranslateY(0);

    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        setTranslateY(digits.length - 1);
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [digit, delay]);

  return (
    <div className="digit-container">
      <div
        className="digit-strip"
        style={{
          transform: `translateY(-${translateY * 2}rem)`,
          transition: `transform ${duration}ms ease-in-out`,
        }}
      >
        {digitList.map((d, i) => (
          <div className="digit" key={i}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

// ✅ React.memo로 감싸기
const RollingDigit = React.memo(RawRollingDigit, (prev, next) => {
  return prev.digit === next.digit;
});


// ===================
// 🔹 RollingNumber
// ===================

const RollingNumber = ({ target }) => {
  const [digits, setDigits] = useState([]);
  const duration = 1000;

  useEffect(() => {
    const str = String(target);
    const arr = str.split("").map(Number);
    setDigits(arr);
  }, [target]);

  return (
    <div className="rolling-number">
      {digits.map((digit, index) => (
        <RollingDigit
          key={index} // 🔐 key 고정
          digit={digit}
          duration={duration}
          delay={(50 + Math.random() * 100) * index}
        />
      ))}
    </div>
  );
};

export default RollingNumber;