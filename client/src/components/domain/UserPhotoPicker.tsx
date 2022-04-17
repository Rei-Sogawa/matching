import { ArrowBackIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, HStack, Image, Input, Stack, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { FC } from "react";
import { BiUpload } from "react-icons/bi";

import { useMultipleFileInput } from "../../hooks/useMultipleFileInput";
import { useObjectURL } from "../../hooks/useObjectURL";

type UserPhotoCardProps = { file: File };

const UserPhotoCard: FC<UserPhotoCardProps> = ({ file }) => {
  const { objectURL } = useObjectURL(file);

  return objectURL ? (
    <Stack>
      <Image src={objectURL} h="240px" rounded="md" htmlWidth="160px" htmlHeight="240px" objectFit="cover" />
      <HStack>
        <Button>
          <ArrowBackIcon />
        </Button>
        <Button>
          <EditIcon />
        </Button>
        <Button>
          <DeleteIcon />
        </Button>
      </HStack>
    </Stack>
  ) : null;
};

export const UserPhotoPicker: FC = () => {
  const { ref, value, onClick, onChange } = useMultipleFileInput();

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
            <UserPhotoCard file={file} />
          </WrapItem>
        ))}
      </Wrap>
    </Stack>
  );
};
