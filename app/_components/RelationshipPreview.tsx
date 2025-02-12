import React from 'react';

interface PreviewImages {
  top?: string[];
  monthly?: string[];
}

interface RelationshipPreviewProps {
  images?: PreviewImages;
  coupleName?: string;
}

const RelationshipPreview = ({ images = {}, coupleName = "Henry and Susan" }) => {
    // Default empty slots for top images (max 3)
    const topImages = Array.from({ length: 3 }).map((_, i) => images.top?.[i] || null);
    
    // Default empty slots for monthly images (max 11)
    const monthlyImages = Array.from({ length: 11 }).map((_, i) => images.monthly?.[i] || null);
  
    return (
      <div className="min-h-screen bg-[#380c0c] relative overflow-hidden">
        {/* Background floral pattern - using a semi-transparent overlay */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src="/api/placeholder/400/800" 
            alt="floral pattern"
            className="w-full h-full object-cover"
          />
        </div>
  
        <div className="relative max-w-2xl mx-auto px-4 py-12">
          {/* Couple's name at top */}
          <h1 className="text-4xl text-white text-center font-serif italic mb-12">
            {coupleName}
          </h1>
  
          {/* Top featured images with overlap effect */}
          <div className="relative h-64 mb-20">
            <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-center w-full">
              {topImages.map((img, index) => (
                <div
                  key={index}
                  className={`w-48 h-48 rounded-lg shadow-xl transform 
                    ${index === 0 ? '-rotate-12 -translate-x-8' : ''} 
                    ${index === 1 ? 'translate-y-4' : ''} 
                    ${index === 2 ? 'rotate-12 translate-x-8' : ''}
                    transition-transform duration-300 hover:scale-105`}
                  style={{
                    backgroundColor: img ? 'transparent' : 'rgba(255,255,255,0.1)',
                    border: img ? 'none' : '2px dashed rgba(255,255,255,0.2)'
                  }}
                >
                  {img ? (
                    <img 
                      src={img} 
                      alt={`Featured ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30">
                      Add Photo
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
  
          {/* Month heading */}
          <h2 className="text-5xl text-white text-center font-serif italic mb-12">
            February
          </h2>
  
          {/* Monthly photos grid */}
          <div className="grid grid-cols-3 gap-6">
            {monthlyImages.map((img, index) => (
              <div
                key={index}
                className="aspect-square bg-white p-2 rounded-sm transform transition-transform duration-300 hover:scale-105 hover:rotate-2"
              >
                {img ? (
                  <img 
                    src={img} 
                    alt={`Monthly ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    Add Photo
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };  

export default RelationshipPreview;
