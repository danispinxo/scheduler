import {useReducer, useEffect} from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {

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

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      dispatch({
        type: SET_APPLICATION_DATA,
        days,
        appointments,
        interviewers,
      });
    });
  }, []);

  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:8001");
    socket.onopen = () => {
      socket.send("ping");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message received: ", event.data);

      if (typeof data === "object" && data.type === "SET_INTERVIEW") {
        dispatch(data);
      }
    };

    return () => socket.close();

  }, [dispatch]);
  
  const bookInterview = (id, interview) => {
    return axios.put(`/api/appointments/${id}`, { interview })
      .then((res) => {
        dispatch({
          type: SET_INTERVIEW,
          id,
          interview,
        });
      });
  };
  
  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
      .then((res) => {
        dispatch({
          type: SET_INTERVIEW,
          id,
          interview: null,
        });
      });
    };

  return { state, setDay, bookInterview, cancelInterview }
}