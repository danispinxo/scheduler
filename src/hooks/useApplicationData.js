import {useState, useEffect} from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  useEffect(() => {Promise.all([
    axios.get('/api/days'),
    axios.get('/api/appointments'),
    axios.get('/api/interviewers')
  ]).then((all) => {
    setState(prev => ({...prev, days: [...all[0].data], appointments: all[1].data, interviewers: all[2].data }));
  })}, [state.day]);
  
  const setDay = day => setState({ ...state, day });
  
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
  
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
  
    return axios.put(`/api/appointments/${id}`, {interview})
      .then((res) => {
        console.log(res);
  
        setState({
          ...state,
          appointments
        });
  
      })
  
  };
  
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
  
    return axios.delete(`/api/appointments/${id}`)
      .then((res) => {
        console.log(res);
        
        setState({
          ...state,
          appointment
        });
      })
  };
  
  return { state, setDay, bookInterview, cancelInterview }
}