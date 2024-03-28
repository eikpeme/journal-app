import { v2 as cloudinary } from 'cloudinary';
import { fileUpload } from '../../helpers';

cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
  secure: true,
})

describe('Tests on fileUpload helper', () => {
  test('should upload the file to cloudinary', async() => {
    const imageUrl = 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
    const resp = await fetch(imageUrl);
    const blob = await resp.blob();
    const file = new File([blob], 'photo.jpg');

    const url:string = await fileUpload(file);
    expect(typeof url).toBe('string');

    const segments = url.split('/');
    const imageId = segments[segments.length - 1].replace('.jpg', '');

    await cloudinary.api.delete_resources(['journal-app/' + imageId]);
  });

  test('should return null', async() => {
    const file = new File([], 'photo.jpg');

    const url = await fileUpload(file);
    expect(url).toBe(null);
  });
});