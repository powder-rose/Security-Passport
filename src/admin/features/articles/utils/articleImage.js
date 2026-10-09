const ARTICLE_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const ARTICLE_IMAGE_MAX_SIZE = 5 * 1024 * 1024;

const ARTICLE_IMAGE_WIDTH = 1200;
const ARTICLE_IMAGE_HEIGHT = 675;

export function getArticleImageValidationError(file) {
  if (!file) {
    return '';
  }

  if (!ARTICLE_IMAGE_TYPES.has(file.type)) {
    return 'Разрешены только JPG, PNG и WEBP';
  }

  if (file.size > ARTICLE_IMAGE_MAX_SIZE) {
    return 'Размер изображения не должен превышать 5 МБ';
  }

  return '';
}

export async function createCroppedArticleImageFile(imageSrc, pixelCrop) {
  const image = await new Promise((resolve, reject) => {
    const element = new Image();

    element.onload = () => resolve(element);
    element.onerror = reject;
    element.src = imageSrc;
  });

  const canvas = document.createElement('canvas');

  canvas.width = ARTICLE_IMAGE_WIDTH;
  canvas.height = ARTICLE_IMAGE_HEIGHT;

  const context = canvas.getContext('2d');

  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    ARTICLE_IMAGE_WIDTH,
    ARTICLE_IMAGE_HEIGHT,
  );

  const blob = await new Promise(resolve => {
    canvas.toBlob(resolve, 'image/webp', 0.9);
  });

  if (!blob) {
    throw new Error('Не удалось подготовить изображение');
  }

  return new File([blob], 'article-image.webp', {
    type: 'image/webp',
  });
}
