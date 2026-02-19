import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Habit } from '@/types';

interface HabitFormProps {
  habit?: Habit;
  closeFunction?: () => void;
  onSubmit: (habitName: string, startTime: string, endTime: string) => void;
  onClick?: () => void;
  closeButton?: boolean;
}

const HabitForm = ({ habit, closeFunction, onSubmit, onClick, closeButton = true }: HabitFormProps) => {
  const [habitName, setHabitName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const formReset = () => {
    setHabitName('');
    setStartTime('');
    setEndTime('');
  };

  const habitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(habitName, startTime, endTime);
    formReset();
  };

  useEffect(() => {
    if (habit) {
      setHabitName(habit.habitName);
      setStartTime(habit.startTime);
      setEndTime(habit.endTime);
    }
  }, []);

  return (
    <form onSubmit={habitSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="habit-name-input">Name</Label>
        <Input
          type="text"
          id="habit-name-input"
          placeholder="Habit Name"
          onChange={(e) => setHabitName(e.target.value)}
          value={habitName}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="start-hour-input">From</Label>
        <Input
          id="start-hour-input"
          type="time"
          aria-label="start-hour"
          onChange={(e) => setStartTime(e.target.value)}
          value={startTime}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="end-hour-input">To</Label>
        <Input
          id="end-hour-input"
          type="time"
          aria-label="end-hour"
          onChange={(e) => setEndTime(e.target.value)}
          value={endTime}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button
          id="add-habit-form-submit"
          type="submit"
          variant="outline"
          className="border border-black hover:shadow-[0px_0px_4px_4px_rgba(0,0,0,0.25)]"
          onClick={onClick}
        >
          Submit
        </Button>

        {closeButton && (
          <Button type="button" variant="outline" onClick={closeFunction}>
            Close
          </Button>
        )}
      </div>
    </form>
  );
};

export default HabitForm;
