import {useState} from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {
    setMode(mode);

    if (replace) {
      const newHistory = history.slice(0, history.length - 1);
      newHistory.push(mode);
      setHistory(newHistory);
    } else {
      setHistory([...history, mode]);
    }
  }

  function back() {
    const newHistory = [...history];
    if (newHistory.length > 1) {
      newHistory.pop();
    }
    setMode(newHistory[newHistory.length - 1]);
    setHistory(newHistory);
  }

  return { mode, transition, back };
}
