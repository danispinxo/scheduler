import React from "react";
import "components/InterviewerList.scss";
import PropTypes from 'prop-types';
import InterviewerListItem from "components/InterviewerListItem";

function InterviewerList({ interviewers, value, onChange}) {

  const interviewerList = interviewers.map(({ id, name, avatar}) => {
    return (
      <InterviewerListItem 
        key={id}
        name={name} 
        avatar={avatar} 
        selected={id === value}
        setInterviewer={() => onChange(id)}  
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

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

export default InterviewerList;