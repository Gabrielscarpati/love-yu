import React from 'react';
import { Heart, Facebook, Instagram, Twitter, Sparkles, Clock, Gift } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

const LandingPage = () => {
  const pricingPlans = [
    {
      title: "Basic Love",
      price: "0.99",
      period: "Weekly",
      features: [
        "Basic countdown timer",
        "3 theme options",
        "Share on social media"
      ],
      icon: Heart,
      popular: false
    },
    {
      title: "Love Plus",
      price: "1.99",
      period: "Monthly",
      features: [
        "Advanced countdown timer",
        "10 premium themes",
        "Custom messages",
        "Photo gallery"
      ],
      icon: Sparkles,
      popular: true
    },
    {
      title: "Forever Love",
      price: "19.90",
      period: "Monthly",
      features: [
        "All premium features",
        "Unlimited themes",
        "Priority support",
        "Custom domain",
        "Advanced analytics"
      ],
      icon: Gift,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-950">
      {/* Background floral pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('/api/placeholder/1920/1080')] bg-repeat"></div>
      
      <div className="relative container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-200 to-pink-100 bg-clip-text text-transparent">
              Make Your Love Timeless
            </h1>
            <p className="text-xl mb-8 text-pink-200">
              Design a unique countdown to celebrate your relationship. Surprise your partner with a one-of-a-kind gift they'll never forget.
            </p>
            <button className="bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg">
              Create website
            </button>
            
            <div className="flex gap-6 mt-12">
              <Facebook className="w-6 h-6 text-pink-300 hover:text-pink-200 cursor-pointer transition-colors" />
              <Instagram className="w-6 h-6 text-pink-300 hover:text-pink-200 cursor-pointer transition-colors" />
              <Twitter className="w-6 h-6 text-pink-300 hover:text-pink-200 cursor-pointer transition-colors" />
            </div>
            
            <p className="mt-8 text-pink-300 flex items-center gap-2">
              <Heart className="w-5 h-5 fill-pink-500" />
              1000+ Happy Couples
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-pink-600 opacity-20 blur-xl rounded-full"></div>
            <img 
              src="headerimage-without-text.png"
              alt="App Preview" 
              className="rounded-3xl shadow-2xl relative transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-center text-white mb-4">Pricing</h2>
          <p className="text-pink-200 text-center mb-12 text-lg">Choose the perfect plan for your love story</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative overflow-hidden flex flex-col justify-between ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white' 
                    : 'bg-gradient-to-br from-red-800 to-red-900 text-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-white text-pink-600 text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pt-8">
                  <plan.icon className={`w-12 h-12 mx-auto mb-4 ${
                    plan.popular ? 'text-white' : 'text-pink-300'
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
                  <button className={`w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                    plan.popular 
                      ? 'bg-white text-pink-600' 
                      : 'bg-pink-500 text-white hover:bg-pink-600'
                  }`}>
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