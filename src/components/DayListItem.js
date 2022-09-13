import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem({ selected, spots, setDay, name }) {
  let dayClass = classNames("day-list__item", {
    "day-list__item--selected": selected,
    "day-list__item--full": (spots === 0)
  });

  const formatSpots = (numOfSpots) => {
    if (numOfSpots === 0) {
      return "no spots remaining";
    } else if (numOfSpots === 1) {
      return "1 spot remaining";
    } else {
      return `${numOfSpots} spots remaining`;
    }
  };

  return (
    <li 
      onClick={() => setDay(name)}
      className={dayClass}
      data-testid="day"
    >
      <h2 className="text--regular">{name}</h2> 
      <h3 className="text--light">{formatSpots(spots)}</h3>
    </li>
  );
}