import { ArrowBackIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, HStack, Image, Input, Stack, useDisclosure, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { ChangeEventHandler, FC, forwardRef, useEffect } from "react";
import { BiUpload } from "react-icons/bi";

import { useObjectURL } from "../../hooks/useObjectURL";
import { CropImageModal } from "../case/CropImageModal";

type UserPhotoCardProps = { file: File; onCrop: (file: File) => void; onRemove: () => void };

const UserPhotoCard: FC<UserPhotoCardProps> = ({ file, onCrop, onRemove }) => {
  const { objectURL, setObject } = useObjectURL(file);

  const modal = useDisclosure();

  return objectURL ? (
    <Stack>
      <Image src={objectURL} h="240px" rounded="md" htmlWidth="160px" htmlHeight="240px" objectFit="cover" />
      <HStack>
        <Button>
          <ArrowBackIcon />
        </Button>
        <Button onClick={modal.onOpen}>
          <EditIcon />
        </Button>
        <Button onClick={onRemove}>
          <DeleteIcon />
        </Button>
      </HStack>
      <Box>
        <CropImageModal file={file} isOpen={modal.isOpen} onClose={modal.onClose} onOk={onCrop} />
      </Box>
    </Stack>
  ) : null;
};

type UserPhotoPickerProps = {
  value: File[];
  onClick: () => void;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onCrop: (file: File, croppedFile: File) => void;
  onRemove: (file: File) => void;
};

export const UserPhotoPicker = forwardRef<HTMLInputElement, UserPhotoPickerProps>(function _UserPhotoPicker(
  { value, onClick, onChange, onCrop, onRemove },
  ref
) {
  return (
    <Stack spacing="4">
      <Box w="80px" h="120px" bg="white" rounded="md" borderWidth="1px" cursor="pointer" onClick={onClick}>
        <VStack h="full" justifyContent="center">
          <Box fontSize="xl">
            <BiUpload />
          </Box>
          <Box>Upload</Box>
        </VStack>

        <Input type="file" accept="image/*" hidden ref={ref} onChange={onChange} />
      </Box>

      <Wrap>
        {value.map((file, index) => (
          <WrapItem key={index}>
            <UserPhotoCard
              file={file}
              onCrop={(croppedFile) => onCrop(file, croppedFile)}
              onRemove={() => onRemove(file)}
            />
          </WrapItem>
        ))}
      </Wrap>
    </Stack>
  );
});
