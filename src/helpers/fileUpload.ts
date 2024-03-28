export const fileUpload = async(file: File) => {
  if (!file) return null;

  const cloudUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append('file', file);

  try {
    const resp = await fetch(cloudUrl, {
      method: 'POST',
      body: formData,
    });
    
    if (!resp.ok) throw new Error('Cannot upload file');

    const cloudRes = await resp.json();

    return cloudRes.secure_url;
  } catch(error) {
    return null;
  }
}
