import { gql } from "@apollo/client";
import { FC } from "react";

import { useHelloQuery } from "../graphql/generated";

gql`
  query hello {
    hello
  }
`;

function Hello() {
  const { data } = useHelloQuery();
  return (
    <div className="h-full flex flex-col justify-center items-center bg-white">
      <div className="text-5xl">{data?.hello}</div>
    </div>
  );
}

export const Index: FC = () => {
  return <Hello />;
};
