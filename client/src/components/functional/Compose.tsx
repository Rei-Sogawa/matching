import { FC, ReactNode } from "react";

type ComposeProps = {
  components: FC[];
  children: ReactNode;
};

export const Compose = ({ components, children }: ComposeProps) => {
  return (
    <>
      {components.reduceRight((acc, Comp) => {
        return <Comp>{acc}</Comp>;
      }, children)}
    </>
  );
};
