import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { WakeAndSleep } from '@/types';

interface WakeAndSleepModalProps {
  updateWakeAndSleep: (wakeTime: string, sleepTime: string) => void;
  wakeAndSleep: WakeAndSleep;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WakeAndSleepModal = ({ updateWakeAndSleep, wakeAndSleep, open, onOpenChange }: WakeAndSleepModalProps) => {
  const [wakeTime, setWakeTime] = useState('');
  const [sleepTime, setSleepTime] = useState('');

  const wakeAndSleepLocal = (e: React.FormEvent) => {
    e.preventDefault();
    updateWakeAndSleep(wakeTime, sleepTime);
    onOpenChange(false);
  };

  useEffect(() => {
    if (wakeAndSleep) {
      setWakeTime(wakeAndSleep.wakeTime);
      setSleepTime(wakeAndSleep.sleepTime);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Wake &amp; Sleep</DialogTitle>
        </DialogHeader>
        <form onSubmit={wakeAndSleepLocal} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="wake-time-input">Wake Time</Label>
            <Input
              type="time"
              id="wake-time-input"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="sleep-time-input">Sleep Time</Label>
            <Input
              type="time"
              id="sleep-time-input"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-fit">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WakeAndSleepModal;
