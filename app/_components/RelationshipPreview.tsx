"use client";

import React from 'react';
import YouTube from 'react-youtube';
import RelationshipCounter from './RelationshipCounter';
import { getYouTubeVideoId } from '../utils/youtube'; // You'll need to create this utility function
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PreviewImages {
  top?: string[];
  monthly?: string[];
}

interface RelationshipPreviewProps {
  images?: PreviewImages;
  coupleName?: string;
  youtubeUrl?: string;
  message?: string;
  startDate?: string;
  startTime?: string;
}

const RelationshipPreview: React.FC<RelationshipPreviewProps> = ({ 
  images = {}, 
  coupleName = "Couple's name",
  youtubeUrl,
  message,
  startDate,
  startTime
}) => {
  // Default empty slots for top images (max 3)
  const topImages = Array.from({ length: 3 }).map((_, i) => images.top?.[i] || null);
  
  // Default empty slots for monthly images (max 9)
  const monthlyImages = Array.from({ length: 9 }).map((_, i) => images.monthly?.[i] || null);

  // Check if a valid YouTube URL is provided.
  const hasYoutube = youtubeUrl && getYouTubeVideoId(youtubeUrl);

  return (
    <div className="min-h-screen bg-[#380c0c] relative overflow-hidden">      
      <div className="relative w-full px-4 py-12">
        {/* Couple's name at top */}
        <h1 className="text-4xl text-white text-center font-serif italic mb-12">
          {coupleName}
        </h1>

        {/* Desktop version - hidden on mobile */}
        <div className="hidden md:block relative h-64 mb-20">
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
                    Photo will <br /> appear here
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile version - shown only on mobile */}
        <div className="md:hidden mb-20">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="w-full h-64"
          >
            {topImages.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-full rounded-lg shadow-xl overflow-hidden">
                  {img ? (
                    <img 
                      src={img} 
                      alt={`Featured ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/10 text-white/30">
                      Photo will <br /> appear here
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Adjust the grid layout based on whether a YouTube video exists */}
        <div className={`grid grid-cols-1 gap-6 mb-20 ${hasYoutube ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {/* YouTube Player */}
          {hasYoutube && (
            <div className="bg-white/10 rounded-lg">
              <div className="aspect-video">
                <YouTube
                  videoId={getYouTubeVideoId(youtubeUrl)!}
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                      autoplay: 0,
                    },
                  }}
                  className="w-full h-full rounded-lg overflow-hidden"
                />
              </div>
            </div>
          )}
      
          {/* Message */}
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-3 text-white">Our Love Story</h3>
            <p className="text-white/80 leading-relaxed">
              {message || "Your love story will appear here"}
            </p>
          </div>
      
          {/* Relationship Counter */}
          <div className=" rounded-lg p-4">
            {startDate && startTime ? (
              <RelationshipCounter
                startDate={startDate}
                startTime={startTime}
              />
            ) : (
              <div className="text-white text-center">
                Add your relationship start date and time to see the counter
              </div>
            )}
          </div>
        </div>

        {/* Month heading */}
        <h2 className="text-5xl text-white text-center font-serif italic mb-12">
          Collage of Memories
        </h2>

        {/* Monthly photos grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  Photo will <br /> appear here
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
