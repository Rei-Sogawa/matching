import { DecodedIdToken } from "firebase-admin/auth";
import { Merge } from "type-fest";

import { Context } from "../context";

export function authorize(context: Context): asserts context is Merge<Context, { decodedIdToken: DecodedIdToken }> {
  if (!context.decodedIdToken) throw new Error("Not Logged in");
}
