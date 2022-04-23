import { Button, Divider, Stack } from "@chakra-ui/react";
import { FC } from "react";
import { Form } from "react-final-form";

import { InputControl } from "../base/AppForm";

type FormValues = {
  email: string;
  password: string;
};

type LogInFormProps = {
  onSubmit: (values: FormValues) => Promise<void>;
};

export const LogInForm: FC<LogInFormProps> = ({ onSubmit }) => {
  const initialValues: FormValues = { email: "", password: "" };

  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          <Stack spacing="4">
            <Stack>
              <InputControl name="email" label="Email" type="email" isRequired />
              <InputControl name="password" label="Password" type="password" autoComplete="on" isRequired />
            </Stack>

            <Divider />

            <Button type="submit" colorScheme="primary" disabled={submitting}>
              Log In
            </Button>
          </Stack>
        </form>
      )}
    />
  );
};
