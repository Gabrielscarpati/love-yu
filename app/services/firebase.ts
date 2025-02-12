import { db, storage } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FormData } from '../types';

export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, `${path}/${file.name}-${Date.now()}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const createWebsite = async (data: FormData, selectedPlan: number): Promise<string> => {
  try {
    // Upload header images
    const headerImageUrls = await Promise.all(
      data.headerImages.map(img => uploadImage(img.file, 'header-images'))
    );

    // Upload gallery images
    const galleryImageUrls = await Promise.all(
      data.galleryImages.map(img => uploadImage(img.file, 'gallery-images'))
    );

    // Create the website document
    const websiteData = {
      couplesName: data.couplesName,
      startDate: data.startDate,
      startTime: data.startTime,
      message: data.message,
      youtubeUrl: data.youtubeUrl,
      headerImages: headerImageUrls,
      galleryImages: galleryImageUrls,
      selectedPlan,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    const docRef = await addDoc(collection(db, 'websites'), websiteData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating website:', error);
    throw error;
  }
};
