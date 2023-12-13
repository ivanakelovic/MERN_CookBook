import React, { useState } from "react";
import "../../css/components.css";

const Dice = ({ sides, onRoll }) => {
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    if (!rolling) {
      setRolling(true);

      setTimeout(() => {
        const result = Math.floor(Math.random() * sides) + 1;
        setRolling(false);
        onRoll(result);
      }, 1000);
    }
  };

  return (
    <div
      className={`dice ${rolling ? "rolling" : ""}`}
      onClick={rollDice}
      role="img"
      aria-label="dice"
    >
      🎲
    </div>
  );
};

export default Dice;
