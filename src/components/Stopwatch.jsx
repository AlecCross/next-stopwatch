//src/components/Stopwatch.jsx

import { useEffect, useState } from "react";

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Завантажуємо збережений стан при запуску сторінки
  useEffect(() => {
    const savedStartTime = localStorage.getItem("stopwatchStartTime");
    const savedRunning = localStorage.getItem("stopwatchRunning");

    if (savedRunning === "true" && savedStartTime) {
      const elapsed = Date.now() - parseInt(savedStartTime, 10);
      setTime(elapsed);
      setIsRunning(true);
    }
  }, []);

  // Оновлення часу, якщо секундомір запущено
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const savedStartTime = localStorage.getItem("stopwatchStartTime");
          return Date.now() - parseInt(savedStartTime, 10);
        });
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Обробка кнопки старт/стоп
  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      localStorage.setItem("stopwatchRunning", "false");
    } else {
      const newStartTime = Date.now() - time;
      localStorage.setItem("stopwatchStartTime", newStartTime.toString());
      localStorage.setItem("stopwatchRunning", "true");
      setIsRunning(true);
    }
  };

  // Обробка кнопки скидання
  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    localStorage.removeItem("stopwatchStartTime");
    localStorage.setItem("stopwatchRunning", "false");
  };

  return (
    <div>
      <h1>
        {Math.floor(time / 60000)
          .toString()
          .padStart(2, "0")}
        :
        {Math.floor((time % 60000) / 1000)
          .toString()
          .padStart(2, "0")}
        :
        {Math.floor((time % 1000) / 10)
          .toString()
          .padStart(2, "0")}
      </h1>
      <button onClick={handleStartStop}>
        {isRunning ? "Зупинити" : "Старт"}
      </button>
      <button onClick={handleReset}>Скинути</button>
    </div>
  );
}
