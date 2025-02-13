import React from 'react';
import { MessageSquareHeart, DollarSign, Mail, Heart } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: "Fill in the details",
      icon: MessageSquareHeart,
      image: "/filling.jpeg",
      description: "Complete the form with your relationship details"
    },
    {
      title: "Make the payment",
      icon: DollarSign,
      image: "payment-interface.svg",
      description: "Choose your plan and complete the payment"
    },
    {
      title: "Receive your site + QR Code via email",
      icon: Mail,
      image: "/scan_qrcode.png",
      description: "Get instant access to your personalized page"
    },
    {
      title: "Surprise your loved one",
      icon: Heart,
      image: "/landingPage_header.png",
      description: "Share your creation with your special someone"
    }
  ];

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start mb-20">
          <div>
            <h2 className="text-5xl font-bold text-white mb-4">
              How<br />it works
            </h2>
            
            {/* Decorative arrow */}
            <div className="relative w-32 h-32">
              <div className="absolute left-12 top-4">
                <div className="relative">
                  {/* Chat bubble with heart */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                    <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                  </div>
                </div>
              </div>
              {/* Curved arrow */}
              <svg className="absolute top-12 left-8" width="120" height="100" viewBox="0 0 120 100" fill="none">
                <path
                  d="M10 10 Q 50 50 80 70 L 95 80"
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M80 85 L 95 80 L 90 65"
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-rose-900/50 to-red-900/50 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300"
            >
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>

              {/* Content */}
              <div className="mb-6">
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-rose-800/50 to-red-800/50 mb-4">
                  <img
                    src={step.image} // Use the image path from the step object
                    alt={`Step ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-pink-200/80">{step.description}</p>
              </div>

              {/* Icon */}
              <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center shadow-lg">
                <step.icon className="w-6 h-6 text-pink-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;