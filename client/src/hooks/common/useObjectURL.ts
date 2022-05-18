import { useEffect, useState } from "react";

export const useObjectURL = (value: File | Blob | undefined) => {
  const [objectURL, setObjectURL] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!value) return;

    const objectURL = URL.createObjectURL(value);
    setObjectURL(objectURL);

    return () => {
      URL.revokeObjectURL(objectURL);
      setObjectURL(undefined);
    };
  }, [value]);

  return {
    objectURL,
  };
};
