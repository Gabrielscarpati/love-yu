export interface PricingPlan {
  title: string;
  price: string;
  period: string;
  features: string[];
  icon: React.ComponentType;
  popular: boolean;
}

export interface PricingOption {
  price: string;
  period: string;
  plan: string;
}

export interface UploadedImage {
  id: string;
  url: string;
  file: File;
}

export interface FormData {
  couplesName: string;
  email: string;
  startDate: string;
  startTime: string;
  message: string;
  youtubeUrl: string;
  headerImages: UploadedImage[];
  galleryImages: UploadedImage[];
  stripePaymentIntentId?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
}

export interface CharacterCounts {
  couplesName: number;
  email: number;
  message: number;
  youtubeUrl: number;
}

export type BenefitsByPlan = {
  [key: number]: string[];
}

export interface Influencer {
  id: string;
  name: string;
  discountPercentage: number;
}
