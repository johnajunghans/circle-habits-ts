import AddHabit from './AddHabit';
import EditHabits from './EditHabits';
import WakeAndSleepModal from './WakeAndSleepModal';
import Toolbar from './Toolbar';
import { useState, useEffect, useCallback, useRef } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import * as d3 from 'd3';
import type { Habit, WakeAndSleep } from '@/types';

const timeToRadians = (time: string): number => {
  const hour = Number(time.slice(0, 2));
  const min = Number(time.slice(3, 5));
  const rawTime = hour + min / 60;
  return (rawTime * 15 - 180) * (Math.PI / 180);
};

const Wheel2 = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [wakeAndSleep, setWakeAndSleep] = useLocalStorage<WakeAndSleep>('wakeAndSleep', {
    wakeTime: '',
    sleepTime: '',
  });
  const [wheelDiam, setWheelDiam] = useState(0);

  const [addHabitOpen, setAddHabitOpen] = useState(false);
  const [editHabitsOpen, setEditHabitsOpen] = useState(false);
  const [wakeAndSleepOpen, setWakeAndSleepOpen] = useState(false);

  const updateWakeAndSleep = (wakeTime: string, sleepTime: string) => {
    setWakeAndSleep({ wakeTime, sleepTime });
  };

  const addHabit = useCallback(
    (url: string, habit: Habit) => {
      setHabits((prevHabits) => [...prevHabits, habit]);
    },
    [setHabits],
  );

  const editHabit = (editedHabit: Habit, loc: string) => {
    const habitId = loc === 'accordion' ? editedHabit.id : modalHabitId;

    const habitsMap = habits.map((habit) => {
      if (habit.id === habitId) {
        return {
          id: habitId,
          habitName: editedHabit.habitName,
          startTime: editedHabit.startTime,
          endTime: editedHabit.endTime,
        };
      }
      return habit;
    });
    setHabits(habitsMap);
  };

  const deleteSingleHabit = (habitId: number) => {
    setHabits(habits.filter((habit) => habit.id !== habitId));
  };

  const deleteAllHabits = () => {
    setHabits([]);
  };

  // Modal functions
  let modalHabitId: number;
  const modalHabitName = 'Edit Habit';
  const updateHabitId = (e: React.MouseEvent<SVGPathElement>) => {
    const data = JSON.parse(e.currentTarget.getAttribute('data') || '{}');
    modalHabitId = data.id;
  };

  //------------------------WHEEL VARIABLES------------------------//
  const wheelWrapper = useRef<HTMLDivElement>(null);
  const wheelRadius = wheelDiam / 2;

  const greyLines = [
    { rot: '0deg', id: 0, style: 'bold' },
    { rot: '15deg', id: 1, style: 'light' },
    { rot: '30deg', id: 2, style: 'light' },
    { rot: '45deg', id: 3, style: 'bold' },
    { rot: '60deg', id: 4, style: 'light' },
    { rot: '75deg', id: 5, style: 'light' },
    { rot: '90deg', id: 6, style: 'bold' },
    { rot: '105deg', id: 7, style: 'light' },
    { rot: '120deg', id: 8, style: 'light' },
    { rot: '135deg', id: 9, style: 'bold' },
    { rot: '150deg', id: 10, style: 'light' },
    { rot: '165deg', id: 11, style: 'light' },
  ];

  const timeMarkers = [
    { time: '6 AM', rot: 0 },
    { time: '9 AM', rot: 45 },
    { time: '12 PM', rot: 90 },
    { time: '3 PM', rot: 135 },
    { time: '6 PM', rot: 180 },
    { time: '9 PM', rot: 225 },
    { time: '12 AM', rot: 270 },
    { time: '3 AM', rot: 315 },
  ];

  //----------------WHEEL RENDERING FUNCTIONS------------------//

  useEffect(() => {
    const rawTime = (time: string) => {
      const hour = Number(time.slice(0, 2));
      const min = Number(time.slice(3, 5));
      return hour * 60 + min;
    };
    setHabits(
      habits.sort((a, b) => {
        if (rawTime(a.startTime) < rawTime(b.startTime)) return -1;
        if (rawTime(a.startTime) > rawTime(b.startTime)) return 1;
        return 0;
      }),
    );
  }, []);

  useEffect(() => {
    if (!wheelWrapper.current) return;
    console.log(wheelWrapper.current.offsetWidth);
    setWheelDiam(wheelWrapper.current.offsetWidth * 0.75);
    const handleResize = () => {
      if (wheelWrapper.current) {
        setWheelDiam(wheelWrapper.current.offsetWidth * 0.75);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function timeToRotation(time: string): number {
    const hour = Number(time.slice(0, 2));
    const min = Number(time.slice(3, 5));
    const rawTime = hour * 1 + min / 60;
    return rawTime * 15 - 90;
  }

  function timeToCoordinate(time: string): [number, number] {
    const angle = (timeToRotation(time) * Math.PI) / 180;
    return [wheelRadius * (1 - Math.cos(angle)), wheelRadius * (1 - Math.sin(angle))];
  }

  // Clock functionality
  const hourHand = useRef<SVGPathElement>(null);
  const clock = (): [number, number] => {
    const now = new Date();
    const hour = now.getHours().toString();
    const min = now.getMinutes().toString();
    const time = hour + ':' + min;
    return timeToCoordinate(time);
  };
  setInterval(clock, 1000);

  //-----------------------RETURN---------------------------//

  return (
    <>
      <Toolbar
        wheelDiam={wheelDiam}
        setWheelDiam={setWheelDiam}
        onAddHabit={() => setAddHabitOpen(true)}
        onEditHabits={() => setEditHabitsOpen(true)}
        onWakeAndSleep={() => setWakeAndSleepOpen(true)}
      />

      <div
        id="wheel-wrapper"
        ref={wheelWrapper}
        className="w-[90%] max-w-[900px] h-auto flex items-start justify-center rounded-[40px] p-4 mx-auto my-4 shadow-[0px_0px_4px_4px_rgba(0,0,0,0.25)]"
        style={{
          background: 'var(--sun-and-earth)',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Outer circle with time markers */}
        <div
          className="m-4 relative flex items-center justify-center rounded-full"
          style={{
            width: wheelDiam * 1.1,
            height: wheelDiam * 1.1,
            background: 'rgba(255,255,255,0.25)',
          }}
        >
          {timeMarkers.map((marker) => (
            <div
              key={marker.rot}
              className="time-markers"
              style={{
                width: wheelRadius,
                left: '0px',
                transform: `rotate(${marker.rot}deg) translate(${wheelDiam * 0.025}px, ${wheelDiam * 0.033}px)`,
                transformOrigin: `${(wheelDiam * 1.1) / 2}px`,
              }}
            >
              <div
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'left',
                  width: wheelRadius / 4,
                  fontSize: wheelRadius / 18,
                }}
              >
                {marker.time}
              </div>
            </div>
          ))}

          {/* Inner wheel circle */}
          <div
            className="border-none rounded-full m-auto relative flex items-center justify-center bg-white"
            style={{ width: wheelDiam + 4, height: wheelDiam + 4 }}
          >
            <svg
              id="svg"
              style={{
                width: wheelDiam,
                height: wheelDiam,
                position: 'absolute',
              }}
            >
              {/* Hour hand */}
              <path
                ref={hourHand}
                d={`M ${wheelRadius} ${wheelRadius} L ${clock()[0]} ${clock()[1]}`}
                className="grey-lines"
                id="hour-hand"
              />

              {/* Grid lines */}
              {greyLines.map((line) => (
                <path
                  d={`M 0 ${wheelRadius} L ${wheelDiam} ${wheelRadius}`}
                  key={line.id}
                  className={`grey-lines ${line.style}`}
                  style={{
                    transform: `rotate(${line.rot})`,
                    transformOrigin: `${wheelRadius}px ${wheelRadius}px`,
                  }}
                />
              ))}

              {/* Habits */}
              <g id="habits-container">
                {habits.map((habit) => {
                  const arcGenerator = d3
                    .arc()
                    .innerRadius(0)
                    .outerRadius(wheelRadius)
                    .startAngle(timeToRadians(habit.startTime))
                    .endAngle(timeToRadians(habit.endTime))
                    .cornerRadius(5);

                  return (
                    <g className="habit-wrapper" key={habit.id}>
                      <path
                        d={arcGenerator(null) ?? undefined}
                        role="button"
                        tabIndex={0}
                        aria-label={`Edit habit: ${habit.habitName} from ${habit.startTime} to ${habit.endTime}`}
                        className="habit-path"
                        transform={`translate(${wheelRadius}, ${wheelRadius})`}
                        onClick={() => setEditHabitsOpen(true)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditHabitsOpen(true)}
                      />
                      <text
                        x={
                          (timeToCoordinate(habit.startTime)[0] + timeToCoordinate(habit.endTime)[0]) / 2
                        }
                        y={
                          (timeToCoordinate(habit.startTime)[1] + timeToCoordinate(habit.endTime)[1]) / 2 +
                          wheelRadius / 16 / 3
                        }
                        className="habit-name"
                        style={{
                          transform: `rotate(${(timeToRotation(habit.startTime) + timeToRotation(habit.endTime)) / 2}deg)`,
                          transformOrigin: `${(timeToCoordinate(habit.startTime)[0] + timeToCoordinate(habit.endTime)[0]) / 2}px ${(timeToCoordinate(habit.startTime)[1] + timeToCoordinate(habit.endTime)[1]) / 2}px`,
                          fontSize: wheelRadius / 20,
                          fill: 'white',
                          fontWeight: 600,
                          pointerEvents: 'none',
                        }}
                      >
                        {habit.habitName}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Sleep arc */}
              {wakeAndSleep && wakeAndSleep.sleepTime && wakeAndSleep.wakeTime && (
                <path
                  id="sleep-path"
                  className="habit-path"
                  d={`
                    M ${wheelRadius} ${wheelRadius}
                    L ${timeToCoordinate(wakeAndSleep.sleepTime)[0]} ${timeToCoordinate(wakeAndSleep.sleepTime)[1]}
                    A ${wheelRadius} ${wheelRadius} 1 0 1
                    ${timeToCoordinate(wakeAndSleep.wakeTime)[0]} ${timeToCoordinate(wakeAndSleep.wakeTime)[1]} z
                  `}
                />
              )}
            </svg>

            {/* Inner decorative circle */}
            <div
              className="z-[2] rounded-full"
              style={{
                width: wheelDiam * (1 / 3),
                height: wheelDiam * (1 / 3),
                background: 'var(--sun-and-earth)',
                backgroundAttachment: 'fixed',
              }}
            />
          </div>
        </div>

        <AddHabit
          addHabit={addHabit}
          habits={habits}
          open={addHabitOpen}
          onOpenChange={setAddHabitOpen}
        />

        <EditHabits
          deleteSingleHabit={deleteSingleHabit}
          deleteAllHabits={deleteAllHabits}
          habits={habits}
          editHabit={editHabit}
          open={editHabitsOpen}
          onOpenChange={setEditHabitsOpen}
        />

        <WakeAndSleepModal
          updateWakeAndSleep={updateWakeAndSleep}
          wakeAndSleep={wakeAndSleep}
          open={wakeAndSleepOpen}
          onOpenChange={setWakeAndSleepOpen}
        />

        {/* EditModal (commented out in original):
        <EditModal editHabit={editHabit} modalHabitName={modalHabitName} open={false} onOpenChange={() => {}} />
        */}
      </div>
    </>
  );
};

export default Wheel2;
