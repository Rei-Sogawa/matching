import { FC } from "react";

export const SwipeNopeBadge: FC = () => {
  return (
    <div className="absolute top-1/4 left-1/4 z-10 origin-top rotate-12 px-3 py-2 border-4 rounded border-red-500 text-red-500 font-bold text-5xl">
      NOPE
    </div>
  );
};
