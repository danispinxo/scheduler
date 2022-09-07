import React from "react";
import DayListItem from "components/DayListItem";

export default function DayList(props) {
  const dayArray = props.days;
  const daysList = dayArray.map((dayArray) => {
    return (
      <DayListItem 
        key={dayArray.id}
        name={dayArray.name} 
        spots={dayArray.spots} 
        selected={dayArray.name === props.value}
        setDay={props.onChange}  
      />
    )
  });

  return (
    <ul>
      {daysList}
    </ul>
  );
}