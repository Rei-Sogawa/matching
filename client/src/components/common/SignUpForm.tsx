import { Button, Divider, Stack } from "@chakra-ui/react";
import { FC } from "react";
import { Form } from "react-final-form";

import { InputControl } from "../base/AppForm";

type FormValues = {
  displayName: string;
  email: string;
  password: string;
  confirm: string;
};

export type SignUpFormProps = {
  onSubmit: (values: FormValues) => Promise<void>;
};

export const SignUpForm: FC<SignUpFormProps> = ({ onSubmit }) => {
  const initialValues: FormValues = { displayName: "", email: "", password: "", confirm: "" };

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
              <InputControl name="displayName" label="Display Name" isRequired />
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
