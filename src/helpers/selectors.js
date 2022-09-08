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