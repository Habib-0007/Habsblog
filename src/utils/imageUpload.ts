import { v4 as uuidv4 } from 'uuid';

interface StoredImage {
  id: string;
  data: string;
  name: string;
  type: string;
}

const imageStorage = new Map<string, StoredImage>();

export const storeImage = (file: File): Promise<StoredImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64 = reader.result as string;

      if (
        !base64 ||
        typeof base64 !== 'string' ||
        !base64.startsWith('data:')
      ) {
        return reject(new Error('Invalid image data'));
      }

      const imageId = uuidv4();

      const storedImage = {
        id: imageId,
        data: base64,
        name: file.name,
        type: file.type,
      };

      imageStorage.set(imageId, storedImage);

      resolve(storedImage);
    };

    reader.onerror = (error) => reject(error);
  });
};

export const getImage = (id: string): StoredImage | undefined => {
  if (!id) return undefined;
  return imageStorage.get(id);
};

export const isImageId = (id: string): boolean => {
  if (!id) return false;
  return imageStorage.has(id);
};

export const createDirectImageMarkdown = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64 = reader.result as string;
      if (!base64 || typeof base64 !== 'string') {
        return reject(new Error('Invalid image data'));
      }

      const markdownText = `![${file.name}](${base64})`;
      resolve(markdownText);
    };

    reader.onerror = (error) => reject(error);
  });
};
