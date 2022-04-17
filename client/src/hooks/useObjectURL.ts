import { useEffect, useState } from "react";

export const useObjectURL = (value: null | File | Blob | MediaSource) => {
  const [object, setObject] = useState<null | File | Blob | MediaSource>(value);
  const [objectURL, setObjectURL] = useState<null | string>(null);

  useEffect(() => {
    if (!object) {
      return;
    }

    const objectURL = URL.createObjectURL(object);
    setObjectURL(objectURL);
    return () => {
      URL.revokeObjectURL(objectURL);
      setObjectURL(null);
    };
  }, [object]);

  return {
    object,
    objectURL,
    setObject,
  };
};
