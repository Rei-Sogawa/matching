import { gql } from "@apollo/client";
import { Swiper } from "antd-mobile";

import { Apollo } from "./contexts/Apollo";
import { AuthProvider } from "./contexts/Auth";
import { useHelloQuery } from "./graphql/generated";

function Fruits() {
  return (
    <Swiper style={{ height: "100%" }} indicator={() => null}>
      <Swiper.Item>
        <div className="h-full bg-yellow-200">
          <div className="h-full flex flex-col justify-center items-center">
            <div className="font-bold">BANANA</div>
          </div>
        </div>
      </Swiper.Item>
      <Swiper.Item>
        <div className="h-full bg-red-400">
          <div className="h-full flex flex-col justify-center items-center">
            <div className="font-bold">APPLE</div>
          </div>
        </div>
      </Swiper.Item>
      <Swiper.Item>
        <div className="h-full bg-purple-200">
          <div className="h-full flex flex-col justify-center items-center">
            <div className="font-bold">GRAPE</div>
          </div>
        </div>
      </Swiper.Item>
    </Swiper>
  );
}

gql`
  query hello {
    hello
  }
`;

function Hello() {
  const { data } = useHelloQuery();

  return <div>{data?.hello}</div>;
}

export function App() {
  return (
    <AuthProvider>
      <Apollo>
        <Hello />
      </Apollo>
    </AuthProvider>
  );
}
