// SEE: https://final-form.org/docs/react-final-form/examples/chakra

import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
  RadioGroup,
} from "@chakra-ui/react";
import { FC } from "react";
import { FieldInputProps, FieldMetaState, useField } from "react-final-form";

export type ControlProps = { name: string } & FormControlProps;

export const Control: FC<ControlProps> = ({ name, ...rest }) => {
  const {
    meta: { error, touched },
  } = useField(name, { subscription: { touched: true, error: true } });
  return <FormControl {...rest} isInvalid={error && touched} />;
};

export type ErrorProps = { name: string };

export const Error: FC<ErrorProps> = ({ name }) => {
  const {
    meta: { error },
  } = useField(name, { subscription: { error: true } });
  return <FormErrorMessage>{error}</FormErrorMessage>;
};

export type InputControlProps = { name: string; label: string } & InputProps;

export const InputControl: FC<InputControlProps> = ({ name, label, ...rest }) => {
  const { input, meta } = useField(name);
  return (
    <Control name={name}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input {...input} id={name} placeholder={label} isInvalid={meta.invalid && meta.touched} {...rest} />
      <Error name={name} />
    </Control>
  );
};

export type AdaptedRadioGroupProps = {
  input: FieldInputProps<any, HTMLElement>;
  meta: FieldMetaState<any>;
  label: string;
};

export const AdaptedRadioGroup: FC<AdaptedRadioGroupProps> = ({ input, meta, label, children }) => (
  <FormControl isInvalid={meta.invalid && meta.touched}>
    <FormLabel htmlFor={input.name}>{label}</FormLabel>
    <RadioGroup {...input}>{children}</RadioGroup>
    <FormErrorMessage fontSize="sm">{meta.error}</FormErrorMessage>
  </FormControl>
);
