import React from "react";

const seconds = () => Math.floor(Date.now() / 1000);
const useCountdown = (endTime: number, onFinish?: () => void) => {
  const [timeLeft, setTimeLeft] = React.useState<number>(endTime - seconds());

  React.useEffect(() => {
    if (endTime === 0) return;

    const interval = setInterval(() => {
      const _timeLeft = endTime - seconds();

      if (_timeLeft <= 0) {
        clearInterval(interval);

        onFinish?.();
      }

      setTimeLeft(_timeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return timeLeft;
};

export default useCountdown;
