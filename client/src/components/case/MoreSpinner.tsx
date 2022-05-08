import { Spinner } from "@chakra-ui/react";
import { FC, useEffect, useRef, useState } from "react";
import useIntersection from "react-use/lib/useIntersection";

type MoreSpinnerProps = {
  cb: () => Promise<void>;
};

export const MoreSpinner: FC<MoreSpinnerProps> = ({ cb }) => {
  const [loading, setLoading] = useState(false);
  const intersectionRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });
  useEffect(() => {
    (async () => {
      if (!loading && intersection && intersection.intersectionRatio >= 1) {
        setLoading(true);
        await cb();
        setLoading(false);
      }
    })();
  }, [intersection]);

  return <Spinner ref={intersectionRef} />;
};
