import api from '../lib/api';

/**
 * Uploads an image to the backend which then uploads to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append('profilePhoto', file);

  const response = await api.patch('/seekers/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data.profilePhotoUrl;
};
