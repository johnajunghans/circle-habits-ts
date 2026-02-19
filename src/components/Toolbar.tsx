import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ToolbarProps {
  wheelDiam: number;
  setWheelDiam: (diam: number) => void;
  onAddHabit: () => void;
  onEditHabits: () => void;
  onWakeAndSleep: () => void;
}

const Toolbar = ({ wheelDiam, setWheelDiam, onAddHabit, onEditHabits, onWakeAndSleep }: ToolbarProps) => {
  const [showWheelStyle, setShowWheelStyle] = useState(false);

  return (
    <div className="flex flex-col gap-1 px-3 py-3 border-t border-b border-black/50">
      <div className="flex flex-row items-center justify-start gap-3">
        <Button
          variant="outline"
          className="font-semibold border border-black bg-white hover:shadow-[0_0_4px_4px_rgba(0,0,0,0.25)]"
          onClick={onAddHabit}
        >
          Add Habit
        </Button>

        <Button
          variant="outline"
          className="font-semibold border border-black bg-white hover:shadow-[0_0_4px_4px_rgba(0,0,0,0.25)]"
          onClick={onEditHabits}
        >
          Edit Habits
        </Button>

        <Button
          variant="outline"
          className="font-semibold border border-black bg-white hover:shadow-[0_0_4px_4px_rgba(0,0,0,0.25)]"
          onClick={onWakeAndSleep}
        >
          Wake &amp; Sleep
        </Button>

        {/* Wheel Styling toggle button (commented out in original)
        <Button
          variant="outline"
          onClick={() => setShowWheelStyle(!showWheelStyle)}
          style={{
            background: showWheelStyle ? 'rgba(0,0,0,0.55)' : 'white',
            color: showWheelStyle ? 'white' : 'black',
          }}
        >
          {!showWheelStyle ? 'Wheel Styling' : 'Hide'}
        </Button>
        */}
      </div>

      {showWheelStyle && (
        <div className="flex flex-row border-t border-black">
          <form className="border border-black rounded-lg p-1 mt-2">
            <label className="text-sm font-medium">Wheel Size</label>
            <input
              type="range"
              className="w-full mt-1"
              id="wheel-size-range"
              min={300}
              max={1200}
              step={10}
              defaultValue={wheelDiam}
              onInput={(e) => setWheelDiam(Number((e.target as HTMLInputElement).value))}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
