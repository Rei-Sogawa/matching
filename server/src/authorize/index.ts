import { DecodedIdToken } from "firebase-admin/auth";
import { Merge } from "type-fest";

import { Context } from "../context";

export function authorize(context: Context): asserts context is Merge<Context, { authContext: DecodedIdToken }> {
  if (!context.authContext) throw new Error("Not Logged in");
}
