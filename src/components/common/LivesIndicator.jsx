import React, { useState, useEffect } from 'react';
import { IoHeart, IoHeartOutline, IoInfinite } from 'react-icons/io5';
import { useCourseData } from '../../context/CourseContext.jsx';
import styles from './LivesIndicator.module.css';

const parseTimeToSeconds = (timeString) => {
  if (!timeString || timeString === "00:00:00") return 0;
  try {
    const parts = timeString.split(':').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return 0;
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } catch (e) {
    return 0;
  }
};

const formatTime = (totalSeconds) => {
  if (totalSeconds <= 0) return "00:00:00";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map(v => v < 10 ? "0" + v : v)
    .join(":");
};

const LivesIndicator = () => {
  const { courseData } = useCourseData();
  
  const lives = courseData?.livesLeft ?? 3;
  const recoveryTime = courseData?.recoveryTimeLeft ?? "00:00:00";

  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() => parseTimeToSeconds(recoveryTime));

  useEffect(() => {
    setSecondsLeft(parseTimeToSeconds(recoveryTime));
  }, [recoveryTime]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timerInterval = setInterval(() => {
      setSecondsLeft(prevSeconds => prevSeconds - 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [secondsLeft]);

  const handleClick = () => {
    if (lives < 3 && lives !== -1 && secondsLeft > 0) {
      setIsTimerVisible(prev => !prev);
    }
  };

  if (!courseData) {
      return null;
  }

  if (lives === -1) {
    return (
      <div className={styles.livesWrapper}>
        <div className={styles.livesContainer}>
          <IoHeart size={28} className={styles.active} />
          <IoInfinite size={28} className={styles.count} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.livesWrapper}>
      <div className={styles.livesContainer} onClick={handleClick}>
        {Array.from({ length: 3 }, (_, i) => {
          const HeartIcon = i < lives ? IoHeart : IoHeartOutline;
          return <HeartIcon key={i} size={28} className={styles.active} />;
        })}
      </div>
      
      {isTimerVisible && secondsLeft > 0 && (
        <div className={styles.timer}>
          {formatTime(secondsLeft)}
        </div>
      )}
    </div>
  );
};

export default LivesIndicator;