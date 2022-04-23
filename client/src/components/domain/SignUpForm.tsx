import { Button, Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react";
import { arrayMoveImmutable } from "array-move";
import { FC } from "react";
import { Form } from "react-final-form";

import { useMultipleFileInput } from "../../hooks/useMultipleFileInput";
import { InputControl } from "../base/AppForm";
import { UserPhotoPicker } from "./UserPhotoPicker";

type FormValues = {
  email: string;
  password: string;
  confirm: string;
};

type FinalFormValues = Omit<FormValues, "photos">;

export type SignUpFormProps = {
  onSubmit: (values: FormValues) => Promise<void>;
};

export const SignUpForm: FC<SignUpFormProps> = ({ onSubmit }) => {
  const initialValues: FinalFormValues = { email: "", password: "", confirm: "" };

  const validate = (values: FinalFormValues) => {
    let res = {};
    if (values.password !== values.confirm) res = { ...res, confirm: "Must match." };
    return res;
  };

  // const { ref, value, setValue, onClick, remove } = useMultipleFileInput();

  // const onSelect = (file: File) => setValue((prev) => prev.concat(file));

  // const onUp = (index: number) => {
  //   const from = index;
  //   const to = index - 1;
  //   if (from < 1) return;
  //   setValue((v) => arrayMoveImmutable(v, from, to));
  // };

  // const onDown = (index: number) => {
  //   const from = index;
  //   const to = index + 1;
  //   if (to > value.length - 1) return;
  //   setValue((v) => arrayMoveImmutable(v, from, to));
  // };

  return (
    <Form
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          <Stack spacing="4">
            {/* <Stack>
              <FormControl>
                <FormLabel>Photos</FormLabel>
                <UserPhotoPicker {...{ ref, value, onClick, onSelect, onUp, onDown, onRemove: remove }} />
              </FormControl>
              <InputControl name="displayName" label="Display  Name" isRequired />
            </Stack>

            <Divider /> */}

            <Stack>
              <InputControl name="email" label="Email" type="email" isRequired />
              <InputControl name="password" label="Password" type="password" autoComplete="on" isRequired />
              <InputControl name="confirm" label="Password Confirm" type="password" autoComplete="on" isRequired />
            </Stack>

            <Divider />

            <Button type="submit" colorScheme="primary" disabled={submitting}>
              Sign Up
            </Button>
          </Stack>
        </form>
      )}
    />
  );
};
