import "react-image-crop/dist/ReactCrop.css";

import { FC, useEffect, useRef, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";

import useObjectURL from "../../hooks/useObjectURL";
import { Modal } from "../base/Modal";

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
  const { objectURL, setObject } = useObjectURL(file);

  useEffect(() => {
    setObject(file);
  }, [file.name]);

  const [crop, setCrop] = useState<Crop>();

  const getCroppedImage = async () => {
    if (!imageRef.current || !crop) throw new Error("Could not crop");
    return cropImage(imageRef.current, file, crop);
  };

  return {
    imageRef,
    objectURL,
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
  const { imageRef, objectURL, crop, setCrop, getCroppedImage } = useCropImage(file);

  const handleOk = async () => onOk(await getCroppedImage());

  const header = <div className="font-bold text-xl">Crop You Photo</div>;

  const body = objectURL ? (
    <ReactCrop crop={crop} onChange={setCrop} aspect={5 / 7} style={{ maxHeight: "50vh" }}>
      <img ref={imageRef} src={objectURL} className="rounded-md" />
    </ReactCrop>
  ) : null;

  const footer = (
    <button onClick={handleOk} className="btn">
      OK
    </button>
  );

  return <Modal isOpen={isOpen} onClose={onClose} header={header} body={body} footer={footer} />;
};
