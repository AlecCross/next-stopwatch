import { useEffect, useState } from "react";
import styles from "../styles/Stopwatch.module.css"; // Додаємо окремий файл стилів

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Стан завантаження

  // Завантаження часу при відкритті сторінки
  useEffect(() => {
    const savedStartTime = localStorage.getItem("stopwatchStartTime");
    const savedRunning = localStorage.getItem("stopwatchRunning");

    if (savedRunning === "true" && savedStartTime) {
      const elapsed = Date.now() - parseInt(savedStartTime, 10);
      setTime(elapsed);
      setIsRunning(true);
    }
    setIsLoading(false); // Завантаження завершено
  }, []);

  // Оновлення часу, якщо секундомір запущений
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        const savedStartTime = localStorage.getItem("stopwatchStartTime");
        setTime(Date.now() - parseInt(savedStartTime, 10));
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Обробка кнопки Старт/Стоп
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

  // Обробка кнопки Скинути
  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    localStorage.removeItem("stopwatchStartTime");
    localStorage.setItem("stopwatchRunning", "false");
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.loader}>⏳ Завантаження...</div>
      ) : (
        <>
          <h1 className={styles.time}>
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
          <div className={styles.buttons}>
            <button onClick={handleStartStop} className={styles.button}>
              {isRunning ? "⏸ Зупинити" : "▶ Старт"}
            </button>
            <button onClick={handleReset} className={styles.buttonReset}>
              🔄 Скинути
            </button>
          </div>
        </>
      )}
    </div>
  );
}
