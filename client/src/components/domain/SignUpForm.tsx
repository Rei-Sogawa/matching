import { Button, FormControl, FormLabel, Stack } from "@chakra-ui/react";
import { FC } from "react";
import { Form } from "react-final-form";

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
                <UserPhotoPicker />
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
