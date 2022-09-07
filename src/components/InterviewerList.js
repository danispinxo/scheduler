import React from "react";
import "components/InterviewerList.scss";
import InterviewerListItem from "components/InterviewerListItem";

export default function InterviewerList(props) {
  const interviewerArray = props.interviewers;

  const interviewerList = interviewerArray.map((interviewerArray) => {
    return (
      <InterviewerListItem 
        key={interviewerArray.id}
        name={interviewerArray.name} 
        avatar={interviewerArray.avatar} 
        selected={interviewerArray.id === props.value}
        setInterviewer={() => props.onChange(interviewerArray.id)}  
      />
    )
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewerList}
      </ul>
    </section>
  );
}