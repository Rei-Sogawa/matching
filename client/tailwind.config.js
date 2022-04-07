/* eslint-disable */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      width: {
        "screen-xs": "480px",
        "screen-sm": "640px",
        "screen-md": "768px",
        "screen-lg": "1024px",
      },
    },
  },
  plugins: [require("daisyui")],
};
