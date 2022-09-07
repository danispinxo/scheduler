import React from "react";
import DayListItem from "components/DayListItem";

export default function DayList({ days, value, onChange}) {
  const dayArray = days;
  const daysList = dayArray.map((dayArray) => {
    return (
      <DayListItem 
        key={dayArray.id}
        name={dayArray.name} 
        spots={dayArray.spots} 
        selected={dayArray.name === value}
        setDay={onChange}  
      />
    )
  });

  return (
    <ul>
      {daysList}
    </ul>
  );
}