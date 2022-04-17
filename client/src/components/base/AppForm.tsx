// SEE: https://final-form.org/docs/react-final-form/examples/chakra

import { FormControl, FormControlProps, FormErrorMessage, FormLabel, Input, InputProps } from "@chakra-ui/react";
import { FC } from "react";
import { useField } from "react-final-form";

type ControlProps = { name: string } & FormControlProps;

const Control: FC<ControlProps> = ({ name, ...rest }) => {
  const {
    meta: { error, touched },
  } = useField(name, { subscription: { touched: true, error: true } });
  return <FormControl {...rest} isInvalid={error && touched} />;
};

type ErrorProps = { name: string };

const Error: FC<ErrorProps> = ({ name }) => {
  const {
    meta: { error },
  } = useField(name, { subscription: { error: true } });
  return <FormErrorMessage>{error}</FormErrorMessage>;
};

type InputControlProps = { name: string; label: string } & InputProps;

export const InputControl: FC<InputControlProps> = ({ name, label, ...rest }) => {
  const { input, meta } = useField(name);
  return (
    <Control name={name}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input {...input} {...rest} isInvalid={meta.error && meta.touched} id={name} placeholder={label} />
      <Error name={name} />
    </Control>
  );
};
