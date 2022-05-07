import { Textarea, TextareaProps } from "@chakra-ui/react";
import { forwardRef } from "react";
import ResizeTextarea from "react-textarea-autosize";

type AuthResizeTextareaProps = {
  minRows?: number;
  maxRows?: number;
} & TextareaProps;

// eslint-disable-next-line react/display-name
export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, AuthResizeTextareaProps>((props, ref) => {
  return <Textarea minH="unset" overflow="hidden" w="100%" resize="none" ref={ref} as={ResizeTextarea} {...props} />;
});
