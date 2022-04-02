import { Swiper } from "antd-mobile";

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

export function App() {
  return (
    <div className="h-full bg-gray-50">
      <Fruits />
    </div>
  );
}
