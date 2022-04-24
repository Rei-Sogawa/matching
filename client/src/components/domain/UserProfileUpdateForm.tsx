import { Button, Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react";
import { pathBuilder } from "@rei-sogawa/path-builder";
import { arrayMoveImmutable } from "array-move";
import imageCompression from "browser-image-compression";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { FC, useEffect, useMemo, useState } from "react";
import { Form } from "react-final-form";
import { v4 } from "uuid";

import { useMe } from "../../contexts/Me";
import { InputControl } from "../base/AppForm";
import { UserPhotoPicker } from "./UserPhotoPicker";

const userProfileStoragePath = pathBuilder("users/:userId/profilePhotos/:profilePhotoId");

type FormValues = {
  photoPaths: string[];
  displayName: string;
};

type FinalFormValues = Omit<FormValues, "photoPaths">;

export type UserProfileUpdateFormProps = {
  initialValues: FormValues;
  onSubmit: (values: FormValues) => Promise<void>;
};

export const UserProfileUpdateForm: FC<UserProfileUpdateFormProps> = ({ initialValues, onSubmit }) => {
  const me = useMe();

  const finalInitialValues: FinalFormValues = useMemo(() => ({ displayName: initialValues.displayName }), []);

  const [photoPaths, setPhotoPaths] = useState<string[]>(initialValues.photoPaths);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const res = await Promise.all(photoPaths.map((photoPath) => getDownloadURL(ref(getStorage(), photoPath))));
      setPhotoUrls(res);
    })();
  }, [photoPaths.length]);

  const onPick = async (file: File) => {
    const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 500 });
    const storageRef = ref(getStorage(), userProfileStoragePath({ userId: me.id, profilePhotoId: v4() }));
    const res = await uploadBytes(storageRef, compressed, { contentType: compressed.type });
    setPhotoPaths((prev) => [...prev, res.ref.fullPath]);
  };

  const onRemove = async (index: number) => {
    const photoPath = photoPaths[index];
    await deleteObject(ref(getStorage(), photoPath));
    setPhotoPaths((prev) => prev.filter((_, _index) => _index !== index));
  };

  const onUp = (index: number) => {
    const from = index;
    const to = index - 1;
    if (from < 1) return;
    setPhotoPaths((v) => arrayMoveImmutable(v, from, to));
    setPhotoUrls((v) => arrayMoveImmutable(v, from, to));
  };

  const onDown = (index: number) => {
    const from = index;
    const to = index + 1;
    if (to > photoPaths.length - 1) return;
    setPhotoPaths((v) => arrayMoveImmutable(v, from, to));
    setPhotoUrls((v) => arrayMoveImmutable(v, from, to));
  };

  const handleFinalSubmit = async (v: FinalFormValues) => {
    await onSubmit({ ...v, photoPaths });
  };

  return (
    <Form
      initialValues={finalInitialValues}
      onSubmit={handleFinalSubmit}
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          <Stack spacing="4">
            <FormControl>
              <FormLabel>Photos</FormLabel>
              <UserPhotoPicker {...{ photoUrls, onPick, onUp, onDown, onRemove }} />
            </FormControl>
            <InputControl name="displayName" label="Display  Name" isRequired />

            <Divider />

            <Button type="submit" colorScheme="primary" disabled={submitting}>
              Save
            </Button>
          </Stack>
        </form>
      )}
    />
  );
};
