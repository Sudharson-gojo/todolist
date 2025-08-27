import React, { useEffect, useState } from 'react';
import './CalendarClock.css';

const Clock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 100);
    return () => clearInterval(id);
  }, []);

  const hours12 = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const millis = String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

  return (
    <div className="glass card clock-card">
      <div className="clock-header">
        <span className="clock-title">Clock</span>
        <span className="clock-info-icon">ⓘ</span>
      </div>
      <div className="clock-display">
        <div className="main-time">
          <span className="big-time">{hours12}</span>
          <span className="time-colon">:</span>
          <span className="big-minutes">{minutes}</span>
          <span className="time-colon">:</span>
          <span className="big-seconds">{seconds}</span>
          <span className="milliseconds">.{millis}</span>
        </div>
        <div className="ampm-display">{ampm}</div>
      </div>
    </div>
  );
};

export default Clock;


