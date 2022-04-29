import { Button, Divider, FormControl, FormLabel, HStack, Radio, Stack } from "@chakra-ui/react";
import { pathBuilder } from "@rei-sogawa/path-builder";
import { arrayMoveImmutable } from "array-move";
import imageCompression from "browser-image-compression";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { FC, useEffect, useMemo, useState } from "react";
import { Field, Form } from "react-final-form";
import { v4 } from "uuid";

import { useMe } from "../../contexts/Me";
import { Gender } from "../../graphql/generated";
import { AdaptedRadioGroup, InputControl } from "../base/AppForm";
import { UserPhotoPicker } from "./UserPhotoPicker";

const userProfileStoragePath = pathBuilder("users/:userId/profilePhotos/:profilePhotoId");

type FormValues = {
  photoPaths: string[];
  gender: Gender;
  nickName: string;
  age: number;
  livingPref: string;
};

type FinalFormValues = Omit<FormValues, "photoPaths">;

export type UserProfileUpdateFormProps = {
  initialValues: FormValues;
  onSubmit: (values: FormValues) => Promise<void>;
};

export const UserProfileUpdateForm: FC<UserProfileUpdateFormProps> = ({ initialValues, onSubmit }) => {
  const me = useMe();

  const finalInitialValues: FinalFormValues = useMemo(
    () => ({
      gender: initialValues.gender,
      nickName: initialValues.nickName,
      age: initialValues.age,
      livingPref: initialValues.livingPref,
    }),
    []
  );

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
    await onSubmit({ ...v, age: Number(v.age), photoPaths });
  };

  return (
    <Form
      initialValues={finalInitialValues}
      onSubmit={handleFinalSubmit}
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          <Stack spacing="4">
            <FormControl>
              <FormLabel>プロフィール写真</FormLabel>
              <UserPhotoPicker {...{ photoUrls, onPick, onUp, onDown, onRemove }} />
            </FormControl>
            <Field name="gender" label="性別" component={AdaptedRadioGroup}>
              <HStack>
                {/* NOTE: Unable to preventDefault inside passive event listener invocation. エラーが発生する。公式でも発生する
                          https://github.com/chakra-ui/chakra-ui/issues/2925 */}
                <Radio value="MALE">男性</Radio>
                <Radio value="FEMALE">女性</Radio>
              </HStack>
            </Field>
            <InputControl name="nickName" label="ニックネーム" isRequired />
            <InputControl name="age" label="年齢" type="number" min="18" isRequired />
            <InputControl name="livingPref" label="居住地" isRequired />

            <Divider />

            <Button type="submit" colorScheme="primary" disabled={submitting}>
              保存
            </Button>
          </Stack>
        </form>
      )}
    />
  );
};
