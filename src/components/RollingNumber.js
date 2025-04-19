/*
Read me!!!----
this code was generated with chatGPT

how to use :

<RollingNumber target = {key}/>

-GYuN 0419 11:46
*/

import React, { useEffect, useRef, useState } from "react";

// 단일 자리 숫자 (Digit)
const RawRollingDigit = ({
  digit,
  duration,
  delay,
  digitClass = "",
  digitStyle = {},
}) => {
  const [digitHeight, setDigitHeight] = useState(null);
  const [digitList, setDigitList] = useState([]);
  const [translateY, setTranslateY] = useState(0);
  const measureRef = useRef(null);

  // 1️⃣ 실제 높이 측정
  useEffect(() => {
    if (measureRef.current && digitHeight === null) {
      const height = measureRef.current.offsetHeight;
      if (height > 0) {
        setDigitHeight(height);
      }
    }
  }, [digitHeight]);

  // 2️⃣ digit 변경되면 애니메이션 준비
  useEffect(() => {
    if (digitHeight === null) return;

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
  }, [digit, delay, digitHeight]);

  return (
    <div
      style={{
        overflow: "hidden",
        width: "1.2ch",
        position: "relative",
        height: digitHeight ?? "auto",
      }}
    >
      {/* ✅ strip을 절대 위치로 고정 */}
      {digitHeight !== null && digitList.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translateY(-${translateY * digitHeight}px)`,
            transition: `transform ${duration}ms ease-in-out`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {digitList.map((d, i) => (
            <div className={digitClass} style={digitStyle} key={i}>
              {d}
            </div>
          ))}
        </div>
      )}

      {/* ✨ 측정용 보이지 않는 숫자 */}
      <div
        ref={measureRef}
        className={digitClass}
        style={{
          ...digitStyle,
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        0
      </div>
    </div>
  );
};

const RollingDigit = React.memo(RawRollingDigit, (prev, next) => {
  return prev.digit === next.digit;
});

// 전체 숫자 구성
const RollingNumber = ({
  target,
  className = "",
  style = {},
  digitClass = "",
  digitStyle = {},
}) => {
  const [digits, setDigits] = useState([]);
  const duration = 1000;

  useEffect(() => {
    const arr = String(target).split("").map(Number);
    setDigits(arr);
  }, [target]);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        gap: "0.2rem",
        ...style,
      }}
    >
      {digits.map((digit, index) => (
        <RollingDigit
          key={index}
          digit={digit}
          duration={duration}
          delay={(50 + Math.random() * 100) * index}
          digitClass={digitClass}
          digitStyle={digitStyle}
        />
      ))}
    </div>
  );
};

export default RollingNumber;