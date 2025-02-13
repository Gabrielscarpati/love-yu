import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Facebook, Instagram, Sparkles, Gift } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import type { PricingPlan } from '../types';
import HowItWorks from './HowItWorks';
import { db } from '@/app/services/firebase'; // Updated import path
import { collection, getCountFromServer } from 'firebase/firestore';


const LandingPage: React.FC = () => {
  const router = useRouter();
  const [couplesCount, setCouplesCount] = useState<number>(0);

  useEffect(() => {
    const fetchCouplesCount = async () => {
      try {
        const coll = collection(db, "websites");
        const snapshot = await getCountFromServer(coll);
        setCouplesCount(snapshot.data().count);
      } catch (error) {
        console.error("Error fetching couples count:", error);
        setCouplesCount(0);
      }
    };

    fetchCouplesCount();
  }, []);

  const pricingPlans: PricingPlan[] = [
    {
      title: "Love",
      price: "6.99",
      period: "Yearly",
      features: [
        "1 Main Photo",
        "5 Secondary Photos",
      ],
      icon: Heart,
      popular: false
    },
    {
      title: "Love Plus",
      price: "8.99",
      period: "Yearly",
      features: [
        "3 Main Photos",
        "9 Secondary Photos",
        "Add Your Song",
      ],
      icon: Sparkles,
      popular: true
    },
    {
      title: "Forever Love",
      price: "14.99",
      period: "One time",
      features: [
        "3 Main Photos",
        "9 Small Photos",
        "Add Your Song",
        "Lifetime Access",
      ],
      icon: Gift,
      popular: false
    }
  ];

  const handleCreateWebsite = (): void => {
    router.push('/create');
  };

  return (
    <div className="min-h-screen bg-[#350100]">
      {/* Background floral pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('/api/placeholder/1920/1080')] bg-repeat"></div>
      
      <div className="relative container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24"> {/* Changed gap-12 to gap-16 */}
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-rose-100 to-pink-100 bg-clip-text text-transparent">
              Make Your Love Timeless
            </h1>
            <p className="text-xl mb-8 text-rose-200">
              Design a unique countdown to celebrate your relationship. Surprise your partner with a one-of-a-kind gift they'll never forget.
            </p>
            <button 
              onClick={handleCreateWebsite}
              className="bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white w-full py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
              Create website
            </button>
          
            <p className="mt-8 text-rose-300 flex items-center gap-2 text-2xl">
              <Heart className="w-10 h-10 fill-rose-400" />
              {couplesCount > 0 ? `${couplesCount} Happy Couples` : 'Happy Couples'}
            </p>
          </div>
          
          <div className="relative mt-40">
            <img 
              src="landingPage_header.png"
              alt="App Preview" 
              className="transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* How It Works Section */}
        <HowItWorks />
        

        {/* Pricing Section */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-center text-white mb-4">Pricing</h2>
          <p className="text-rose-200 text-center mb-12 text-lg">Choose the perfect plan for your love story</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative overflow-hidden flex flex-col justify-between ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-rose-400 to-rose-500 text-white' 
                    : 'bg-gradient-to-br from-rose-900 to-red-900 text-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-white text-rose-600 text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pt-8">
                  <plan.icon className={`w-12 h-12 mx-auto mb-4 ${
                    plan.popular ? 'text-white' : 'text-rose-300'
                  }`} />
                  <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                </CardHeader>
                
                <CardContent className="text-center p-6 flex-grow">
                  <div className="flex justify-center items-baseline mb-8">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-lg ml-2">/{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <button 
onClick={handleCreateWebsite}
                    className="w-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
                  >
                    Get Started
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;