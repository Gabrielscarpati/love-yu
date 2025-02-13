import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/services/firebase";
import RelationshipPreview from "@/app/_components/RelationshipPreview";

interface PageProps {
  params: {
    coupleId: string;
  };
}

export default async function WebsitePage({ params }: PageProps) {
  const { coupleId } = params;

  const docRef = doc(db, "websites", coupleId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return <div>Website not found</div>;
  }

  const formData = docSnap.data();

  // Prepare images object from Firestore data
  const images = {
    top: formData.headerImages || [],
    monthly: formData.galleryImages || []
  };

  return (
    <RelationshipPreview
      coupleName={formData.couplesName}
      images={images}
      youtubeUrl={formData.youtubeUrl}
      message={formData.message}
      startDate={formData.startDate}
      startTime={formData.startTime}
    />
  );
}