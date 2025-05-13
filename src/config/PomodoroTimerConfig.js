// Example TIMER_CONFIG
const TIMER_CONFIG = {
  work: {
    id: 'work',
    duration: 25, // minutes
    label: 'Work',
    color: 'bg-red-500',
    autoStartNext: true,
    autoStart: true,
  },
  shortBreak: {
    id: 'shortBreak',
    duration: 5,
    label: 'Short Break',
    color: 'bg-green-500',
    autoStartNext: true,
    autoStart: true,
  },
  longBreak: {
    id: 'longBreak',
    duration: 15,
    label: 'Long Break',
    color: 'bg-blue-500',
    interval: 4, // Number of work sessions before a long break
    autoStartNext: true,
    autoStart: true,
  }
};
export default TIMER_CONFIG;
