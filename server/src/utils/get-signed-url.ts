import { addMinutes } from "date-fns";
import { Storage } from "firebase-admin/storage";

export const getSignedUrl = async (storage: Storage, path: string) => {
  if (process.env.NODE_ENV !== "production") {
    return storage.bucket().file(path).publicUrl();
  }

  return storage
    .bucket()
    .file(path)
    .getSignedUrl({ action: "read", expires: addMinutes(new Date(), 5) })
    .then((res) => res[0] as string);
};
