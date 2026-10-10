import { useEffect, useRef, useState } from 'react';

import { uploadArticleImage } from '../../../api/adminApi.js';
import {
  createCroppedArticleImageFile,
  getArticleImageValidationError,
} from '../utils/articleImage.js';

export function useArticleImage({ onUploaded }) {
  const [cropImage, setCropImage] = useState(null);
  const cropImageRef = useRef(null);

  function revokePreview(image) {
    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }
  }

  function closeCrop() {
    revokePreview(cropImageRef.current);

    cropImageRef.current = null;
    setCropImage(null);
  }

  function selectImage(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = getArticleImageValidationError(file);

    if (validationError) {
      alert(validationError);

      event.target.value = '';

      return;
    }

    revokePreview(cropImageRef.current);

    const nextCropImage = {
      file,
      preview: URL.createObjectURL(file),
    };

    cropImageRef.current = nextCropImage;
    setCropImage(nextCropImage);

    event.target.value = '';
  }

  async function cropAndUpload(pixelCrop) {
    const currentCropImage = cropImageRef.current;

    if (!currentCropImage) {
      return;
    }

    try {
      const file = await createCroppedArticleImageFile(currentCropImage.preview, pixelCrop);

      const result = await uploadArticleImage(file);

      if (!result?.ok || !result.url) {
        if (result?.error === 'INVALID_IMAGE') {
          alert('Не удалось обработать изображение. Выберите другой файл.');
        } else {
          alert('Не удалось загрузить изображение.');
        }

        return;
      }

      onUploaded(result.url);
    } catch (error) {
      console.error(error);

      alert('Не удалось загрузить изображение. Попробуйте ещё раз.');
    } finally {
      closeCrop();
    }
  }

  useEffect(() => {
    return () => {
      const currentCropImage = cropImageRef.current;

      if (currentCropImage?.preview) {
        URL.revokeObjectURL(currentCropImage.preview);
      }

      cropImageRef.current = null;
    };
  }, []);

  return {
    cropImage,
    selectImage,
    cancelCrop: closeCrop,
    cropAndUpload,
  };
}
