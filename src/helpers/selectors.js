export function getAppointmentsForDay(state, day) {
  const output = [];

  for (const date of state.days) {
    if (date.name === day) {
      for (const elem of date.appointments) {
        output.push(state.appointments[elem]);
      }
    }
  }

  return output;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewerId = interview.interviewer;

  const output = {
    student: interview.student,
    interviewer: state.interviewers[interviewerId]
  };

  return output;
}

export function getInterviewersForDay(state, day) {
  const output = [];

  for (const date of state.days) {
    if (date.name === day) {
      for (const elem of date.interviewers) {
        output.push(state.interviewers[elem]);
      }
    }
  }

  return output;
}