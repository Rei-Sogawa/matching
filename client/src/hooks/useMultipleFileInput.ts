import { ChangeEventHandler, useRef, useState } from "react";

export const useMultipleFileInput = () => {
  const ref = useRef<HTMLInputElement | null>(null);

  const [value, setValue] = useState<File[]>([]);

  const onClick = () => ref.current?.click();

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (!files || !files[0]) {
      return;
    }
    setValue((prev) => prev.concat(files[0]));
  };

  const remove = (index: number) => setValue((prev) => prev.filter((_, idx) => idx !== index));

  const reset = () => setValue([]);

  return { ref, value, setValue, onClick, onChange, remove, reset };
};
