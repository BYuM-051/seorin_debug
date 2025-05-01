/*
Read me!!!----
this code was generated with chatGPT

how to use :

<RollingNumber target = {key}/>

-GYuN 0419 11:46
*/

import React, { useEffect, useRef, useState } from "react";

// 단일 숫자 자리 컴포넌트
const RollingDigit = React.memo(function RollingDigit({
  digit,
  duration = 1500,
  delay = 0,
  digitClass = "",
  digitStyle = {},
}) {
  const [digitHeight, setDigitHeight] = useState(null);
  const [digits, setDigits] = useState([]);
  const [translateY, setTranslateY] = useState(0);
  const measureRef = useRef(null);

  // digitHeight 측정: 렌더 직후 안정화된 레이아웃 기준
  useEffect(() => {
    if (!measureRef.current || digitHeight !== null) return;

    let frame = 0;
    const measureLoop = () => {
      const h = measureRef.current.offsetHeight;
      if (h > 0 || frame >= 4) {
        setDigitHeight(h > 0 ? h : 32); // fallback 최소값
      } else {
        frame++;
        requestAnimationFrame(measureLoop);
      }
    };
    measureLoop();
  }, [digitHeight]);

  // digitHeight 확정 후 애니메이션 트리거
  useEffect(() => {
    if (digitHeight === null || digitHeight === 0) return;

    const loop = 4;
    const digitList = Array.from({ length: loop * 10 }, (_, i) => i % 10).concat(digit);
    setDigits(digitList);
    setTranslateY(0);

    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        setTranslateY(digitList.length - 1);
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [digit, digitHeight, delay]);

  // 높이 측정 전에는 placeholder 렌더링 (Hook 순서 유지)
  if (digitHeight === null || digitHeight === 0) {
    return (
      <div style={{ width: "1.2ch", height: "2rem", visibility: "hidden" }}>
        <div ref={measureRef} className={digitClass} style={digitStyle}>
          0
        </div>
      </div>
    );
  }

  // 정상 렌더링
  return (
    <div
      style={{
        overflow: "hidden",
        width: "1.2ch",
        height: digitHeight,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
          transform: `translateY(-${translateY * digitHeight}px)`,
          transition: `transform ${duration}ms ease-in-out`,
        }}
      >
        {digits.map((d, i) => (
          <div className={digitClass} style={digitStyle} key={i}>
            {d}
          </div>
        ))}
      </div>

      {/* 높이 측정용 */}
      <div
        ref={measureRef}
        className={digitClass}
        style={{
          ...digitStyle,
          visibility: "hidden",
          position: "absolute",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        0
      </div>
    </div>
  );
});

// 전체 숫자 조립 컴포넌트
export default function RollingNumber({
  target = 0,
  className = "",
  style = {},
  digitClass = "",
  digitStyle = {},
}) {
  const [digits, setDigits] = useState([]);

  useEffect(() => {
    const newDigits = String(target).split("").map(Number);
    setDigits(newDigits);
  }, [target]);

  return (
    <div
      className={className}
      style={{ display: "flex", gap: "0.2rem", ...style }}
    >
      {digits.map((digit, index) => (
        <RollingDigit
          key={`${index}-${digit}`}
          digit={digit}
          digitClass={digitClass}
          digitStyle={digitStyle}
          delay={index * 100}
        />
      ))}
    </div>
  );
}