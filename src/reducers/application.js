export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {

  function calculateSpots(appointments) {
    const dayIndex = state.days.findIndex(day => state.day === day.name);
    const currentDay = state.days[dayIndex];

    const spots = currentDay.appointments.filter(appointmentId => !appointments[appointmentId].interview).length;

    const day = {...state.days[dayIndex], spots}
    const days = [...state.days];
    days[dayIndex] = day;

    return days;
  }

  switch (action.type) {

    case SET_DAY:
      return { ...state, day: action.day };

    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      };

    case SET_INTERVIEW:
      const { id, interview } = action;

      const appointment = {
        ...state.appointments[id],
        interview,
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };

      return { ...state, appointments, days: calculateSpots(appointments) };

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}
