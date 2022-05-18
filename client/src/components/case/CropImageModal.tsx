import "react-image-crop/dist/ReactCrop.css";

import { Button, HStack, Image, Modal, ModalBody, ModalContent, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { FC, useEffect, useRef, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";

import { useObjectURL } from "../../hooks/common/useObjectURL";
import { assertDefined } from "../../utils/assert-defined";
import { AppHeading } from "../base/AppHeading";

const getBlobFromCanvas = (canvas: HTMLCanvasElement, file: File): Promise<File> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], file.name, { lastModified: file.lastModified, type: "image/*" }));
      } else {
        reject("Canvas is empty");
      }
    }, file.type);
  });

const cropImage = async (imageRef: HTMLImageElement, file: File, crop: Crop) => {
  const canvas = document.createElement("canvas");
  const scaleX = imageRef.naturalWidth / imageRef.width;
  const scaleY = imageRef.naturalHeight / imageRef.height;
  const pixelRatio = window.devicePixelRatio;
  const ctx = canvas.getContext("2d");

  canvas.width = crop.width * pixelRatio * scaleX;
  canvas.height = crop.height * pixelRatio * scaleY;

  if (!ctx) throw new Error("Not found ctx");

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    imageRef,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );

  return await getBlobFromCanvas(canvas, file);
};

const useCropImage = (file: File) => {
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = useState<Crop>();

  const getCroppedImage = async () => {
    if (!imageRef.current || !crop) throw new Error("Could not crop");
    return cropImage(imageRef.current, file, crop);
  };

  return {
    imageRef,
    crop,
    setCrop,
    getCroppedImage,
  };
};

type CropImageModalProps = {
  file: File;
  isOpen: boolean;
  onClose: () => void;
  onOk: (file: File) => void;
};

export const CropImageModal: FC<CropImageModalProps> = ({ file, isOpen, onClose, onOk }) => {
  const toast = useToast();

  // NOTE: IPad で 100vh にならないので、頑張ってる
  const [height, setHeight] = useState("100vh");
  useEffect(() => {
    const rootRef = document.getElementById("root");
    assertDefined(rootRef);
    setHeight(`${rootRef.clientHeight}px`);
  }, []);

  const { imageRef, crop, setCrop, getCroppedImage } = useCropImage(file);
  const { objectURL } = useObjectURL(file);

  const handleOk = async () => {
    if (!crop) toast({ title: "範囲が選択されていません。", status: "error", position: "top-right" });
    onOk(await getCroppedImage());
    onClose();
    setCrop(undefined);
  };

  return (
    <Modal size="full" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent height={height} py="4" my="auto" rounded="none" overflow="auto">
        <ModalBody>
          <Stack maxW="container.sm" mx="auto" spacing="8">
            <AppHeading alignSelf="center">切り抜き</AppHeading>

            {objectURL ? (
              <ReactCrop crop={crop} onChange={setCrop} aspect={1 / 1} minWidth={100}>
                <Image ref={imageRef} src={objectURL} w="full" />
              </ReactCrop>
            ) : null}

            <HStack alignSelf="end">
              <Button onClick={onClose} variant="ghost">
                キャンセル
              </Button>
              <Button onClick={handleOk} disabled={!crop} colorScheme="primary">
                完了
              </Button>
            </HStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
