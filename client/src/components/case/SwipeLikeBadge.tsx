import { FC } from "react";

export const SwipeLikeBadge: FC = () => {
  return (
    <div className="absolute top-1/4 right-1/4 z-10 origin-top -rotate-12 px-3 py-2 border-4 rounded border-green-500 text-green-500 font-bold text-5xl">
      LIKE
    </div>
  );
};
