export interface Habit {
  id: number;
  habitName: string;
  startTime: string;
  endTime: string;
}

export interface WakeAndSleep {
  wakeTime: string;
  sleepTime: string;
}
