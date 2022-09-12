import {useState} from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {
    console.log("Mode at line 8", mode);
    setMode(mode);

    if (replace) {
      const newHistory = history.slice(0, history.length);
      newHistory.push(mode);
      setHistory(newHistory);
    } else {
      const newHistory = [...history];
      newHistory.push(mode);
      console.log("New history", newHistory);
      setHistory(newHistory);
      console.log("State history", history);
    }
  }

  function back() {
    const newHistory = [...history];
    newHistory.pop();
    setMode(newHistory[newHistory.length - 1]);
    setHistory(newHistory);

  }

  return {
    mode, 
    transition,
    back
  };
}
