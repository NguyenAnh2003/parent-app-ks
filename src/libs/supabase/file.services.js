import { appStorage } from './supabase';

export const uploadImage = async (imageUri) => {
  /**
   * @param file - used for uploading file to bucket
   */
  try {
    const { data } = await appStorage.upload(`public/${Date.now()}.jpg`, {
      uri: imageUri,
    });
    if (data) return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const getImageUrl = (path) => {
  try {
    const { data } = appStorage.getPublicUrl(path);
    if (data) return data.publicUrl;
  } catch (error) {
    console.log(error.message);
  }
};
