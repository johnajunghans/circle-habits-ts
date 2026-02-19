import HabitForm from './HabitForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Habit } from '@/types';

interface EditModalProps {
  editHabit: (habit: Omit<Habit, 'id'>, loc: string) => void;
  modalHabitName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditModal = ({ editHabit, modalHabitName, open, onOpenChange }: EditModalProps) => {
  const editHabitLocal = (habitName: string, startTime: string, endTime: string) => {
    const editedHabit = { habitName, startTime, endTime };
    editHabit(editedHabit, 'modal');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{modalHabitName}</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <HabitForm onSubmit={editHabitLocal} closeButton={false} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
