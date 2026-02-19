import HabitForm from './HabitForm';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { Habit } from '@/types';

interface AddHabitProps {
  addHabit: (url: string, habit: Habit) => void;
  habits: Habit[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddHabit = ({ addHabit, open, onOpenChange }: AddHabitProps) => {
  const addHabitSubmit = (habitName: string, startTime: string, endTime: string) => {
    const newHabit: Habit = {
      id: Math.round(Math.random() * 100000000),
      habitName,
      startTime,
      endTime,
    };
    addHabit('http://localhost:3000/habits', newHabit);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="bg-white/85 backdrop-blur-sm">
        <SheetHeader>
          <SheetTitle>Add New Habit</SheetTitle>
        </SheetHeader>
        <div className="mt-4 px-1">
          <HabitForm onSubmit={addHabitSubmit} closeButton={false} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddHabit;
