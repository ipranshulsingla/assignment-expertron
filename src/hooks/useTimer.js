import { useCallback, useEffect, useRef, useState } from 'react';

export default function useTimer({ seconds, onExpiry, autostart = false }) {
  const [remainingTime, setRemainingTime] = useState(seconds);
  const [isRunning, setRunning] = useState(autostart);

  const onExpiryRef = useRef();
  onExpiryRef.current = onExpiry;

  useEffect(() => {
    if (!isRunning) return;

    if (remainingTime <= 0) return;

    const id = setTimeout(() => {
      setRemainingTime(t => {
        if (t - 1 === 0) {
          onExpiryRef.current && onExpiryRef.current();
          setRunning(false);
        }
        return t - 1;
      });
    }, 1000);

    return () => clearTimeout(id);
  }, [remainingTime, isRunning]);

  const restart = useCallback(() => {
    setRemainingTime(seconds);
    setRunning(true);
  }, [seconds]);

  const stop = useCallback(() => {
    setRemainingTime(seconds);
    setRunning(false);
  }, [seconds]);

  return { remainingTime, isRunning, restart, stop };
}
