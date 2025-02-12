import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "../config/firebase";
import type { FormData } from "../types";

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const storage = getStorage(app);

export const createWebsite = async (formData: FormData, selectedPlan: number) => {
  try {
    const docRef = await addDoc(collection(db, "websites"), {
      couplesName: formData.couplesName,
      email: formData.email,
      startDate: formData.startDate,
      startTime: formData.startTime,
      message: formData.message,
      youtubeUrl: formData.youtubeUrl,
      headerImages: formData.headerImages.map(img => img.url),
      galleryImages: formData.galleryImages.map(img => img.url),
      plan: selectedPlan,
      userEmail: formData.email,
      urlSee: `https://loveyou-9e3bf.web.app/${formData.couplesName}`,
      urlUpdate: `https://loveyou-9e3bf.web.app/${formData.couplesName}/${generateRandomSegment(20)}`
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

function generateRandomSegment(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}