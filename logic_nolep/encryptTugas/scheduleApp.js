import moment from 'moment';

function scheduleTask() {
  const tugas = moment(new Date()).add(3, 'days') 
  return `Scheduled task for: ${tugas}`
}
export { scheduleTask };

