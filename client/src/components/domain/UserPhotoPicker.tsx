import { ArrowBackIcon, ArrowForwardIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, HStack, Image, Input, Stack, useDisclosure, Wrap, WrapItem } from "@chakra-ui/react";
import { head } from "lodash-es";
import { ChangeEventHandler, FC, forwardRef, useEffect, useState } from "react";
import { BiUpload } from "react-icons/bi";

import { useObjectURL } from "../../hooks/useObjectURL";
import { CropImageModal } from "../case/CropImageModal";

type UserPhotoCardProps = { file: File; onUp: () => void; onDown: () => void; onRemove: () => void };

const UserPhotoCard: FC<UserPhotoCardProps> = ({ file, onUp, onDown, onRemove }) => {
  const { objectURL, setObject } = useObjectURL(file);

  useEffect(() => setObject(file), [file]);

  return objectURL ? (
    <Stack>
      <Image src={objectURL} rounded="md" w="200px" h="250px" />
      <HStack justifyContent="center">
        <Button size="sm" onClick={onUp}>
          <ArrowBackIcon />
        </Button>
        <Button size="sm" onClick={onDown}>
          <ArrowForwardIcon />
        </Button>
        <Button size="sm" onClick={onRemove}>
          <DeleteIcon />
        </Button>
      </HStack>
    </Stack>
  ) : null;
};

type UserPhotoPickerProps = {
  value: File[];
  onClick: () => void;
  onSelect: (v: File) => void;
  onUp: (index: number) => void;
  onDown: (index: number) => void;
  onRemove: (index: number) => void;
};

export const UserPhotoPicker = forwardRef<HTMLInputElement, UserPhotoPickerProps>(function _UserPhotoPicker(
  { value, onClick, onSelect, onUp, onDown, onRemove },
  ref
) {
  const modal = useDisclosure();
  const [croppingFile, setCroppingFile] = useState<File>();

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (!files) return;
    const file = head(files);
    if (!file) return;
    setCroppingFile(file);
    modal.onOpen();
    return;
  };

  const onClose = () => {
    setCroppingFile(undefined);
    modal.onClose();
  };

  const onOk = (file: File) => {
    onSelect(file);
    onClose();
  };

  return (
    <Stack>
      <Box>
        <Button size="sm" onClick={onClick} leftIcon={<BiUpload />}>
          Upload
        </Button>
        <Input type="file" accept="image/*" hidden ref={ref} onChange={onChange} />
        <Box>
          {croppingFile && <CropImageModal file={croppingFile} isOpen={modal.isOpen} onClose={onClose} onOk={onOk} />}
        </Box>
      </Box>

      {value.length > 0 && (
        <Wrap>
          {value.map((file, index) => (
            <WrapItem key={index}>
              <UserPhotoCard
                file={file}
                onUp={() => onUp(index)}
                onDown={() => onDown(index)}
                onRemove={() => onRemove(index)}
              />
            </WrapItem>
          ))}
        </Wrap>
      )}
    </Stack>
  );
});
