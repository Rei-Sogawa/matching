import { SetRequired } from "type-fest";

import { Context } from "../context";

export function authorize(context: Context): asserts context is SetRequired<Context, "uid"> {
  if (!context.uid) throw new Error("Not Logged in");
}
