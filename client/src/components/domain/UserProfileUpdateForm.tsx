import { Button, Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react";
import { arrayMoveImmutable } from "array-move";
import { FC } from "react";
import { Form } from "react-final-form";

import { useMultipleFileInput } from "../../hooks/useMultipleFileInput";
import { InputControl } from "../base/AppForm";
import { UserPhotoPicker } from "./UserPhotoPicker";

type FormValues = {
  displayName: string;
};

export type UserProfileUpdateFormProps = {
  onSubmit: (values: FormValues) => Promise<void>;
};

export const UserProfileUpdateForm: FC<UserProfileUpdateFormProps> = ({ onSubmit }) => {
  const initialValues: FormValues = { displayName: "" };

  const { ref, value, setValue, onClick, remove } = useMultipleFileInput();

  const onSelect = (file: File) => setValue((prev) => prev.concat(file));

  const onUp = (index: number) => {
    const from = index;
    const to = index - 1;
    if (from < 1) return;
    setValue((v) => arrayMoveImmutable(v, from, to));
  };

  const onDown = (index: number) => {
    const from = index;
    const to = index + 1;
    if (to > value.length - 1) return;
    setValue((v) => arrayMoveImmutable(v, from, to));
  };

  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          <Stack spacing="4">
            <FormControl>
              <FormLabel>Photos</FormLabel>
              <UserPhotoPicker {...{ ref, value, onClick, onSelect, onUp, onDown, onRemove: remove }} />
            </FormControl>
            <InputControl name="displayName" label="Display  Name" isRequired />

            <Divider />

            <Button type="submit" colorScheme="primary" disabled={submitting}>
              Save
            </Button>
          </Stack>
        </form>
      )}
    />
  );
};
