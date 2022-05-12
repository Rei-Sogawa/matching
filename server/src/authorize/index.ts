import { Context } from "../context";

export function authorize(auth: Context["auth"]): asserts auth is { uid: string } {
  if (!auth) throw new Error("Not Logged in");
}
