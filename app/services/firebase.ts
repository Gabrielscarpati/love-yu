import { initializeApp, getApps } from "firebase/app";
import { 
  getFirestore, collection, addDoc, updateDoc, doc, getDoc 
} from "firebase/firestore";
import { 
  getStorage, ref, uploadBytes, getDownloadURL 
} from "firebase/storage";
import { firebaseConfig } from "../config/firebase";
import type { FormData } from "../types";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const storage = getStorage(app);

// Helper function to generate a unique file name
const generateUniqueFileName = (fileName: string) =>
  `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${fileName}`;

export const createWebsite = async (formData: FormData, selectedPlan: number) => {
  try {
    // Create the website entry without image URLs and urlUpdate
    const docRef = await addDoc(collection(db, "websites"), {
      couplesName: formData.couplesName,
      email: formData.email,
      startDate: formData.startDate,
      startTime: formData.startTime,
      message: formData.message,
      youtubeUrl: formData.youtubeUrl,
      plan: selectedPlan,
      userEmail: formData.email,
      urlSee: `https://luv-stories.com/${formData.couplesName}`,
    });

    // Upload header images and generate unique names for each image
    const headerImageUrls = await Promise.all(
      formData.headerImages.map(async (img) => {
        const uniqueFileName = generateUniqueFileName(img.fileName);
        const storageRef = ref(storage, `websites/${docRef.id}/headerImages/${uniqueFileName}`);
        const snapshot = await uploadBytes(storageRef, img.file);
        return await getDownloadURL(snapshot.ref);
      })
    );

    // Upload gallery images with unique names
    const galleryImageUrls = await Promise.all(
      formData.galleryImages.map(async (img) => {
        const uniqueFileName = generateUniqueFileName(img.fileName);
        const storageRef = ref(storage, `websites/${docRef.id}/galleryImages/${uniqueFileName}`);
        const snapshot = await uploadBytes(storageRef, img.file);
        return await getDownloadURL(snapshot.ref);
      })
    );

    // Update the record with the image URLs and urlUpdate field
    await updateDoc(docRef, {
      headerImages: headerImageUrls,
      galleryImages: galleryImageUrls,
      urlUpdate: `https://loveyou-9e3bf.web.app/${docRef.id}`,
    });


    return docRef.id;
  } catch (e) {
    console.error("Error:", e);
    throw e;
  }
};

