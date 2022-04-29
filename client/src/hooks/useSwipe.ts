import { useDrag } from "@use-gesture/react";
import { useRef, useState } from "react";
import { SpringValue, to as interpolate, useSprings } from "react-spring";

const transform = (rot: number) => `rotateZ(${rot}deg)`;

type UseSwipeOptions = { length: number; onRight: () => void; onLeft: () => void; onEnd: () => void };

export const useSwipe = ({ length, onRight, onLeft, onEnd }: UseSwipeOptions) => {
  const [dragging, setDragging] = useState(false);

  const gone = useRef(new Set());

  const [toRight, setToRight] = useState(false);
  const [toLeft, setToLeft] = useState(false);

  const [springs, springsApi] = useSprings(length, () => ({
    x: 0,
    y: 0,
    rot: 0,
  }));

  const bind = useDrag(({ args: [index], active, movement: [mx, my], direction: [xDir], velocity: [vx] }) => {
    setDragging(active);

    if (active && Math.abs(mx) > 0) {
      if (mx > 0) {
        setToRight(true);
        setToLeft(false);
      } else {
        setToRight(false);
        setToLeft(true);
      }
    } else {
      setToRight(false);
      setToLeft(false);
    }

    const trigger = vx > 0.2;
    if (!active && trigger) {
      gone.current.add(index);
      xDir > 0 ? onRight() : onLeft();

      if (gone.current.size === length) {
        onEnd();
      }
    }

    springsApi.start((i) => {
      if (index !== i) return;

      const isGone = gone.current.has(index);

      const x = isGone ? (200 + window.innerWidth) * xDir : active ? mx : 0;
      const y = active ? my : 0;
      const rot = active ? mx / 25 : 0;

      return {
        x,
        y,
        rot,
        delay: 0,
        config: { duration: isGone ? 750 : !active ? 250 : 0 },
      };
    });
  });

  const style = (rot: SpringValue<number>) => ({ transform: interpolate([rot], transform) });

  return { dragging, toRight, toLeft, swipeItems: springs, bind, style };
};
