import { Button, FormControl, FormLabel, Stack } from "@chakra-ui/react";
import { arrayMoveImmutable } from "array-move";
import { FC, useEffect } from "react";
import { Form } from "react-final-form";

import { useMultipleFileInput } from "../../hooks/useMultipleFileInput";
import { InputControl } from "../base/AppForm";
import { UserPhotoPicker } from "./UserPhotoPicker";

type FormValues = {
  email: string;
  password: string;
  confirm: string;
  displayName: string;
};

type SignUpFormProps = {
  onSubmit: (values: FormValues) => Promise<void>;
};

export const SignUpForm: FC<SignUpFormProps> = ({ onSubmit }) => {
  const initialValues: FormValues = { email: "", password: "", confirm: "", displayName: "" };

  const validate = (values: FormValues) => {
    let res = {};
    if (values.password !== values.confirm) res = { ...res, confirm: "Must match." };
    return res;
  };

  const { ref, value, setValue, onClick, onChange, remove } = useMultipleFileInput();

  const onUp = (index: number) => {
    const from = index;
    const to = index - 1;
    if (from < 1) return;
    setValue((v) => arrayMoveImmutable(v, from, to));
  };

  const onCrop = (index: number, croppedFile: File) => {
    setValue((prev) => prev.map((v, idx) => (idx === index ? croppedFile : v)));
  };

  return (
    <Form
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          <Stack spacing="4">
            <Stack>
              <FormControl>
                <FormLabel>Photo</FormLabel>
                <UserPhotoPicker {...{ ref, value, onClick, onChange, onUp, onCrop, onRemove: remove }} />
              </FormControl>

              <InputControl name="email" label="Email" type="email" isRequired />
              <InputControl name="password" label="Password" type="password" autoComplete="on" isRequired />
              <InputControl name="confirm" label="Password Confirm" type="password" autoComplete="on" isRequired />
              <InputControl name="displayName" label="Display  Name" isRequired></InputControl>
            </Stack>
            <Button type="submit" colorScheme="primary" disabled={submitting}>
              Sign Up
            </Button>
          </Stack>
        </form>
      )}
    />
  );
};
