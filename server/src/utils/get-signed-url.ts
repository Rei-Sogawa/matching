import { addMinutes } from "date-fns";
import { Storage } from "firebase-admin/storage";

export const getSignedUrl = async (storage: Storage, path: string) => {
  // NOTE: サンプルデータ
  if (path.startsWith("https://i.pravatar.cc/")) return path;

  if (process.env.NODE_ENV !== "production") {
    return storage.bucket().file(path).publicUrl();
  }

  return storage
    .bucket()
    .file(path)
    .getSignedUrl({ action: "read", expires: addMinutes(new Date(), 60) })
    .then((res) => res[0] as string);
};
