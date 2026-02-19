import { useState } from 'react';
import HabitForm from './HabitForm';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import type { Habit } from '@/types';

interface EditHabitsProps {
  habits: Habit[];
  editHabit: (habit: Habit, loc: string) => void;
  deleteAllHabits: () => void;
  deleteSingleHabit: (habitId: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditHabits = ({ habits, editHabit, deleteSingleHabit, open, onOpenChange }: EditHabitsProps) => {
  const [showEditHabit, setShowEditHabit] = useState(false);
  const [habitId, setHabitId] = useState<number | null>(null);

  const editHabits = (habitName: string, startTime: string, endTime: string) => {
    console.log(habitId);
    const editedHabit: Habit = {
      id: habitId!,
      habitName,
      startTime,
      endTime,
    };
    editHabit(editedHabit, 'accordion');
    setShowEditHabit(false);
    setHabitId(null);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-white/85 backdrop-blur-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Habits</SheetTitle>
        </SheetHeader>

        <div className="mt-4 px-1">
          <h6 className="text-sm font-semibold mb-2">List of Active Habits</h6>
          <hr className="mb-3" />

          <Accordion type="single" collapsible className="flex flex-col mb-3">
            {habits.map((habit) => (
              <AccordionItem value={`habit-${habit.id}`} key={habit.id}>
                <AccordionTrigger className="text-sm">
                  {habit.habitName} {`(${habit.startTime} - ${habit.endTime})`}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 pt-1">
                    {!showEditHabit && (
                      <Button
                        variant="outline"
                        className="border-yellow-500 text-yellow-700 hover:bg-yellow-50 w-fit"
                        onClick={() => setShowEditHabit(true)}
                      >
                        Edit Habit
                      </Button>
                    )}

                    {showEditHabit && (
                      <HabitForm
                        habit={habit}
                        onSubmit={editHabits}
                        onClick={() => setHabitId(habit.id)}
                        closeFunction={() => setShowEditHabit(false)}
                      />
                    )}

                    {!showEditHabit && (
                      <Button
                        variant="destructive"
                        className="w-fit"
                        onClick={() => deleteSingleHabit(habit.id)}
                      >
                        Delete Habit
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <hr />
          {/* Delete All Habits button (commented out in original)
          <Button variant="destructive" id="delete-habits" onClick={deleteAllHabits} className="mt-3">
            Delete All Habits
          </Button>
          */}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditHabits;
