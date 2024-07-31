import { useCallback, useState, useRef } from "react";
import ProfileImage from "./ProfileImage";
import { Skeleton } from "./ui/skeleton";
import Cropper from "react-easy-crop";

export default function ProfileImageUploader({ formData, croppedImage, setCroppedImage }) {
  const [newImage, setNewImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);

  // handleFileChange function to remove the croppedImage and set the newImage
  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCroppedImage(null);
      setNewImage(URL.createObjectURL(e.target.files[0]));
      // Reset input value to allow same file selection
      e.target.value = null;
    }
  }, []);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Inside your component
  const generateCroppedImage = useCallback(async () => {
    // Function to create cropped image from the croppedAreaPixels
    const croppedImgBlobUrl = await getCroppedImg(newImage, croppedAreaPixels);
    const croppedImgDataUrl = await blobToImage(croppedImgBlobUrl);
    setCroppedImage(croppedImgDataUrl);
    setNewImage(null); // Reset newImage after cropping
  }, [croppedAreaPixels, newImage]);

  const resetImageUpload = () => {
    setNewImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="flex flex-row items-center gap-5">
      {!formData ?
        <Skeleton className="w-[150px] h-[150px] bg-muted rounded-full" />
        : croppedImage === null ?
          <ProfileImage src={formData.profileImage} width={150} height={150} alt={"Dein Profilbild"} />
          :
          <ProfileImage src={croppedImage} width={150} height={150} alt={"Dein Profilbild"} className={"w-[150px] h-[150px] rounded-full object-cover"} />
      }
      <label
        htmlFor="fileInput"
        className="inline-block cursor-pointer text text-secondary hover:underline"
        onClick={resetImageUpload}
      >
        Profilbild ändern
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </label>
      {newImage && (
        <div className="crop-container z-50 absolute top-0 left-0 h-screen w-screen bg-black/60 backdrop-blur-sm">
          <div className="w-1/2 h-1/2 translate-x-1/2 translate-y-1/2 bg-background">
            <div className="relative h-full w-full">
              <Cropper
                image={newImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(e.target.value)
              }}
              className="zoom-range mt-6"
            />
            <button type="button" className="btn btn-primary mx-auto mt-4" onClick={generateCroppedImage}>Speichern</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Utility function to get the cropped image (this needs to be implemented)
async function getCroppedImg(imageSrc, crop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(URL.createObjectURL(file));
      } else {
        reject(new Error('Canvas is empty'));
      }
    }, 'image/jpeg');
  });
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
}

// Utility function to convert blob URL to base64 image data URL
function blobToImage(binaryUrl) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const img = document.createElement('img');
    img.src = binaryUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0, img.width, img.height);
      resolve(canvas.toDataURL());
    };
    img.onerror = (error) => reject(error);
  });
}