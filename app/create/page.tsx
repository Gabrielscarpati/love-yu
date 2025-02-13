"use client";

import React, { useState, useEffect, ChangeEvent, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, Music, ImagePlus, Heart, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { FormData, CharacterCounts, PricingOption, BenefitsByPlan } from '../types';
import { v4 as uuidv4 } from 'uuid';
import RelationshipPreview from '../_components/RelationshipPreview';
import { sendConfirmationEmail, EmailData } from '../utils/sendConfirmationEmail';
import YouTube from 'react-youtube';
import getStripe from '../utils/get-stripe';
import { 
  createWebsite, 
  checkInfluencerCode, 
  updateInfluencerStats 
} from "../services/firebase";

interface Influencer {
  id: string;
  name: string;
  amountCollected: number;
  appliedQnty: number;
}

const CustomizePage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    couplesName: '',
    email: '',
    startDate: '',
    startTime: '',
    message: '',
    youtubeUrl: '',
    headerImages: [],
    galleryImages: [],
    userEmail: '',
    urlSee: '',
    urlUpdate: ''
  });

  const [characterCounts, setCharacterCounts] = useState<CharacterCounts>({
    couplesName: 0,
    email: 0,
    message: 0,
    youtubeUrl: 0
  });

  const pricingOptions: PricingOption[] = [
    { price: "6.99", period: "Yearly", plan: "Basic" },
    { price: "8.99", period: "Yearly", plan: "Plus" },
    { price: "14.99", period: "One time", plan: "Forever" }
  ];

  const [selectedPlan, setSelectedPlan] = useState<number>(0);
  const [hasReferral, setHasReferral] = useState<boolean>(false);
  const [referralCode, setReferralCode] = useState<string>("");
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [isValidCode, setIsValidCode] = useState(false);
  const [discountedPrices, setDiscountedPrices] = useState<PricingOption[]>([]);

  useEffect(() => {
    setDiscountedPrices([...pricingOptions]);
  }, []);

  const benefitsByPlan: BenefitsByPlan = {
    0: [
      "1 Main Photo",
      "5 Small Photos",
      "No Song"
    ],
    1: [
      "3 Main Photos",
      "9 Small Photos",
      "Song"
    ],
    2: [
      "3 Main Photos",
      "9 Small Photos",
      "Song",
      "Forever"
    ]
  };

  const headerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Whenever the plan changes, if it's Basic, trim extra images.
  useEffect(() => {
    if (selectedPlan === 0) {
      setFormData(prev => ({
        ...prev,
        headerImages: prev.headerImages.slice(0, 1),
        galleryImages: prev.galleryImages.slice(0, 5)
      }));
    }
  }, [selectedPlan]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setCharacterCounts(prev => ({
      ...prev,
      [name]: value.length
    }));
  };

  const handleImageUpload = (type: 'header' | 'gallery') => (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    let maxImages = 0;
    if (type === 'header') {
      maxImages = selectedPlan === 0 ? 1 : 3;
    } else {
      maxImages = selectedPlan === 0 ? 5 : 9;
    }
    const imageArray = type === 'header' ? 'headerImages' : 'galleryImages';
    const currentImages = formData[imageArray];

    if (currentImages.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    const newImages = Array.from(files).map(file => ({
      id: uuidv4(),
      url: URL.createObjectURL(file),
      file
    }));

    setFormData(prev => ({
      ...prev,
      [imageArray]: [...prev[imageArray], ...newImages]
    }));
  };

  const removeImage = (type: 'header' | 'gallery', id: string) => {
    const imageArray = type === 'header' ? 'headerImages' : 'galleryImages';
    setFormData(prev => ({
      ...prev,
      [imageArray]: prev[imageArray].filter(img => img.id !== id)
    }));
  };

  // Transform the images for the preview component
  const previewImages = {
    top: formData.headerImages.map(img => img.url),
    monthly: formData.galleryImages.map(img => img.url)
  };


  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Add this function near your other validation functions
  const isValidReferralCode = (code: string): boolean => {
    return code.length === 6;
  };

  // Add this function to handle referral code validation
  const handleReferralCodeChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.slice(0, 6);
    setReferralCode(code);

    // Reset prices if code length is not 6
    if (code.length !== 6) {
      setIsValidCode(false);
      setDiscountedPrices([...pricingOptions]);
      return;
    }

    setIsCheckingCode(true);
    const influencer = await checkInfluencerCode(code);
    
    if (influencer) {
      setIsValidCode(true);
      // Calculate discounted prices
      const discounted = pricingOptions.map(option => ({
        ...option,
        price: (parseFloat(option.price) * 0.9).toFixed(2) // 10% discount
      }));
      setDiscountedPrices(discounted);
    } else {
      setIsValidCode(false);
      setDiscountedPrices([...pricingOptions]); // Reset prices if code is invalid
      alert('Invalid referral code');
    }
    setIsCheckingCode(false);
  };

  // Modify the handleCreateWebsite function
  const handleCreateWebsite = useCallback(async () => {
    try {
      setIsSubmitting(true);

      if (!formData.couplesName || !formData.startDate || !formData.startTime) {
        alert('Please fill in all required fields');
        return;
      }

      if (!isValidEmail(formData.userEmail)) {
        alert('Please enter a valid email address');
        return;
      }

      // Updated referral code validation with new error message
      if (hasReferral && !isValidReferralCode(referralCode)) {
        alert('If the checkbox is selected you need to enter all the 6 numbers to receive the discount');
        return;
      }

      // Populate new fields
      const updatedFormData = {
        ...formData,
        userEmail: formData.email,
        urlSee: `https://example.com/${formData.couplesName}`,
        urlUpdate: `https://example.com/`
      };
      
      // Pass updatedFormData to Firebase
      const websiteId = await createWebsite(updatedFormData, selectedPlan);
      
      // Calculate the transaction amount
      const transactionAmount = parseFloat(discountedPrices[selectedPlan]?.price || pricingOptions[selectedPlan].price);

      // Update influencer stats if a valid referral code was used
      if (hasReferral && isValidCode && referralCode) {
        await updateInfluencerStats(referralCode, transactionAmount);
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: pricingOptions[selectedPlan].plan,
          price: discountedPrices[selectedPlan]?.price || pricingOptions[selectedPlan].price,
          period: pricingOptions[selectedPlan].period,
          websiteId: websiteId,
        }),
      });
  
      const { sessionId } = await response.json();
  
      // Load Stripe and redirect to Checkout
      const stripe = await getStripe();
      if (!stripe) throw new Error('Stripe failed to load');
  
      const { error } = await stripe.redirectToCheckout({ sessionId });

      const toEmail = "gabrielbrsc15@gmail.com";
      const emailData: EmailData = {
        coupleNames: "John & Jane",
        websiteUrl: "https://luv-stories.com/abc123",
        updateUrl: "https://luv-stories.com/abc123/edit"
      };

      await sendConfirmationEmail(toEmail, emailData);

      router.push(`/${websiteId}`);
    } catch (error) {
      console.error('Error creating website:', error);
      alert('Failed to create website. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedPlan, router, hasReferral, isValidCode, referralCode, discountedPrices, pricingOptions]);

  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="min-h-screen bg-[#350100] p-8">
      <div className="w-full">
        <h1 className="text-4xl font-bold text-white mb-8">Customize Your Website!</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Input Fields */}
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-pink-200 mb-2">Couple's Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-300 w-5 h-5" />
                  <input
                    type="text"
                    name="couplesName"
                    value={formData.couplesName}
                    onChange={handleInputChange}
                    className="w-full bg-red-950/50 border border-pink-500/30 rounded-lg py-3 px-10 text-white placeholder-pink-300/50"
                    placeholder="Henry and Susan (Only Use Characters)"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-300 text-sm">
                    {characterCounts.couplesName}
                  </span>
                </div>
                <p className="text-pink-300/70 text-sm mt-1">Helper Text</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-pink-200 mb-2">Relationship Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5 pointer-events-none" />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full bg-red-950/50 border border-pink-500/30 rounded-lg py-3 px-10 text-white"
                      min="1900-01-01"
                      max={new Date().toISOString().split("T")[0]}
                      onFocus={(e) => e.target.showPicker()}
                    />
                  </div>
                  <p className="text-pink-300/70 text-sm mt-1">Helper Text</p>
                </div>

                <div className="relative">
                  <label className="block text-pink-200 mb-2">Relationship Start Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5 pointer-events-none" />
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full bg-red-950/50 border border-pink-500/30 rounded-lg py-3 px-10 text-white"
                      onFocus={(e) => e.target.showPicker()}
                    />
                  </div>
                  <p className="text-pink-300/70 text-sm mt-1">Helper Text</p>
                </div>
              </div>

              <div className="relative">
                <label className="block text-pink-200 mb-2">Message for the couple</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-red-950/50 border border-pink-500/30 rounded-lg py-3 px-4 text-white placeholder-pink-300/50 min-h-[120px]"
                  placeholder="Share your heartfelt message here. Make it truly memorable! ❤"
                  maxLength={2000}
                />
                <span className="absolute right-3 bottom-3 text-pink-300 text-sm">
                  {characterCounts.message}
                </span>
                <p className="text-pink-300/70 text-sm mt-1">Helper Text</p>
              </div>

              {/* Render Youtube Song input only if plan is Plus or Forever */}
              {selectedPlan !== 0 && (
                <div className="relative">
                  <label className="block text-pink-200 mb-2">Youtube Song (Optional)</label>
                  <div className="relative">
                    <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-300 w-5 h-5" />
                    <input
                      type="url"
                      name="youtubeUrl"
                      value={formData.youtubeUrl}
                      onChange={handleInputChange}
                      className="w-full bg-red-950/50 border border-pink-500/30 rounded-lg py-3 px-10 text-white placeholder-pink-300/50"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                  <p className="text-pink-300/70 text-sm mt-1">Helper Text</p>
                  
                  {formData.youtubeUrl && getYouTubeVideoId(formData.youtubeUrl) && (
                    <div className="mt-4">
                      <YouTube
                        videoId={getYouTubeVideoId(formData.youtubeUrl)!}
                        opts={opts}
                        className="w-full rounded-lg overflow-hidden"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="relative">
                <label className="block text-pink-200 mb-2">
                  Enter the email address where we will send the QR code for you to share with your loved one.
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-300 w-5 h-5" />
                  <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    className="w-full bg-red-950/50 border border-pink-500/30 rounded-lg py-3 px-10 text-white placeholder-pink-300/50"
                    placeholder="e.g. yourname@example.com"
                    required
                  />
                </div>
                <p className="text-pink-300/70 text-sm mt-1">Helper Text</p>
              </div>
            </div>

            {/* Image Upload Sections */}
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-4">
                  Select images of you and your loved one that you want to appear first at the top of the page
                </h3>
                <input
                  type="file"
                  ref={headerInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload('header')}
                />
                <div className="grid grid-cols-3 gap-4">
                  {formData.headerImages.map((image) => (
                    <div key={image.id} className="relative aspect-square">
                      <img
                        src={image.url}
                        alt="Header preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <button
                        onClick={() => removeImage('header', image.id)}
                        className="absolute top-2 right-2 bg-red-500 p-1 rounded-full text-white hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {formData.headerImages.length < (selectedPlan === 0 ? 1 : 3) && (
                    <div
                      onClick={() => headerInputRef.current?.click()}
                      className="aspect-square bg-pink-300/20 rounded-xl flex items-center justify-center cursor-pointer hover:bg-pink-300/30 transition-colors"
                    >
                      <ImagePlus className="w-8 h-8 text-pink-300" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-white mb-4">
                  Add additional images of you and your loved one to appear in the gallery section
                </h3>
                <input
                  type="file"
                  ref={galleryInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload('gallery')}
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.galleryImages.map((image) => (
                    <div key={image.id} className="relative aspect-square">
                      <img
                        src={image.url}
                        alt="Gallery preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <button
                        onClick={() => removeImage('gallery', image.id)}
                        className="absolute top-2 right-2 bg-red-500 p-1 rounded-full text-white hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {formData.galleryImages.length < (selectedPlan === 0 ? 5 : 9) && (
                    <div
                      onClick={() => galleryInputRef.current?.click()}
                      className="aspect-square bg-pink-300/20 rounded-xl flex items-center justify-center cursor-pointer hover:bg-pink-300/30 transition-colors"
                    >
                      <ImagePlus className="w-8 h-8 text-pink-300" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Price Selection */}
            <div className="flex flex-wrap gap-2">
              {discountedPrices.map((option, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPlan(i)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
                    selectedPlan === i
                      ? 'bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg transform scale-105'
                      : 'bg-white/10'
                  } text-white w-full transition-all`}
                >
                  <span className="text-lg font-bold">${option.price}</span>
                  <span className="text-sm opacity-75">{option.period}</span>
                  <span className="text-xs">{option.plan}</span>
                  {isValidCode && <span className="text-xs text-green-400">10% off applied!</span>}
                </button>
              ))}
            </div>

            {/* Benefits */}
            <Card className="bg-red-950/50 border-pink-500/30">
              <CardContent className="p-6">
                <h3 className="text-white text-xl mb-4">Plan Benefits</h3>
                <ul className="space-y-3 text-pink-200">
                  {benefitsByPlan[selectedPlan].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Referral Code Input Field */}
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="block text-white font-medium mr-2">
                  Were you referred by someone?   
                </label>
                <input
                  type="checkbox"
                  checked={hasReferral}
                  onChange={(e) => setHasReferral(e.target.checked)}
                  className="w-6 h-6 accent-rose-500" // Basic styling; adjust as needed
                />
              </div>
              {hasReferral && (
                <div className="mt-2">
                  <p className="text-sm text-pink-300">
                    Enter the code to receive 10% off
                  </p>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={handleReferralCodeChange}
                    placeholder="Enter 6-character code"
                    maxLength={6}
                    className={`w-full bg-red-950/50 border ${
                      referralCode.length === 6 
                        ? isValidCode 
                          ? 'border-green-500' 
                          : 'border-red-500'
                        : 'border-pink-500/30'
                    } rounded-lg py-2 px-3 text-white placeholder-pink-300/50`}
                  />
                </div>
              )}
            </div>

            {/* Conditional Create Website Button or Error Message */}
            {hasReferral && (!isValidCode || referralCode.length !== 6) ? (
              <div className="w-full p-4 bg-red-950/50 border border-red-500/30 rounded-lg text-center">
                <p className="text-red-300">
                  {referralCode.length < 6 
                    ? "Please enter a complete 6-digit referral code or uncheck the referral option"
                    : "Invalid referral code. Please try a different code or uncheck the referral option"}
                </p>
              </div>
            ) : (
              <button 
                onClick={handleCreateWebsite}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : `Create website for $${discountedPrices[selectedPlan]?.price || pricingOptions[selectedPlan].price}/${pricingOptions[selectedPlan].period}`}
              </button>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white mb-8">Preview</h2>
          <div className="w-full bg-white rounded-xl overflow-hidden shadow-2xl">
            <RelationshipPreview 
              images={previewImages}
              coupleName={formData.couplesName || undefined}
              youtubeUrl={formData.youtubeUrl}
              message={formData.message}
              startDate={formData.startDate}
              startTime={formData.startTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizePage;
