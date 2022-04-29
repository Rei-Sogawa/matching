import { Button, Divider, Stack } from "@chakra-ui/react";
import { FC } from "react";
import { Form } from "react-final-form";

import { InputControl } from "../base/AppForm";

type FormValues = {
  email: string;
  password: string;
  confirm: string;
};

export type SignUpFormProps = {
  onSubmit: (values: FormValues) => Promise<void>;
};

export const SignUpForm: FC<SignUpFormProps> = ({ onSubmit }) => {
  const initialValues: FormValues = { email: "", password: "", confirm: "" };

  const validate = (values: FormValues) => {
    let res = {};
    if (values.password !== values.confirm) res = { ...res, confirm: "パスワードが一致しません。" };
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
              <InputControl name="email" label="Eメール" type="email" isRequired />
              <InputControl name="password" label="パスワード" type="password" autoComplete="on" isRequired />
              <InputControl name="confirm" label="パスワード確認" type="password" autoComplete="on" isRequired />
            </Stack>

            <Divider />

            <Button type="submit" colorScheme="primary" disabled={submitting}>
              サインアップ
            </Button>
          </Stack>
        </form>
      )}
    />
  );
};
