import "react-image-crop/dist/ReactCrop.css";

import {
  Button,
  Center,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { FC, useEffect, useRef, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";

import { useObjectURL } from "../../hooks/useObjectURL";

const getBlobFromCanvas = (canvas: HTMLCanvasElement, file: File): Promise<File> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], file.name, { lastModified: file.lastModified }));
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
  const { imageRef, crop, setCrop, getCroppedImage } = useCropImage(file);
  const { objectURL, setObject } = useObjectURL(file);

  const handleOk = async () => {
    onOk(await getCroppedImage());
    onClose();
    setCrop(undefined);
  };

  useEffect(() => {
    setObject(file);
  }, [file]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crop</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {objectURL ? (
            <Center>
              <ReactCrop crop={crop} onChange={setCrop} aspect={4 / 5}>
                <Image ref={imageRef} src={objectURL} w="full" h="auto" />
              </ReactCrop>
            </Center>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleOk} disabled={!crop}>
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
