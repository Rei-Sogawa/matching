import { Merge } from "type-fest";

import { Context } from "../context";

export function authorize(context: Context): asserts context is Merge<Context, { auth: { uid: string } }> {
  if (!context.auth) throw new Error("Not Logged in");
}
