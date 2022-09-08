export function getAppointmentsForDay(state, day) {
  const output = [];

  for (const each of state.days) {
    if (each.name === day) {
      for (const elem of each.appointments) {
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
    interviewer: {
      id: interviewerId,
      name: state.interviewers[interviewerId].name,
      avatar: state.interviewers[interviewerId].avatar
    }
  };

  return output;
}

export function getInterviewersForDay(state, day) {
  const output = [];

  for (const each of state.days) {
    if (each.name === day) {
      for (const elem of each.interviewers) {
        output.push(state.interviewers[elem]);
      }
    }
  }

  return output;
}