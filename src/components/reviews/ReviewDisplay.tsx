
import { useState } from 'react';
import { Star, ThumbsUp, Calendar, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Review } from '@/types/product';
import Image from 'next/image';

interface ReviewDisplayProps {
  reviews: Review[];
}

const ReviewDisplay = ({ reviews }: ReviewDisplayProps) => {
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());

  const formatDateUTC = (dateString: string) => {
    const d = new Date(dateString);
    return d.toISOString().slice(0, 10);
  };

  const handleHelpful = (reviewId: string) => {
    setHelpfulReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const MediaCarousel = ({ images, videos }: { images?: string[]; videos?: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const allMedia = [...(images || []), ...(videos || [])];
    
    if (allMedia.length === 0) return null;

    const nextMedia = () => {
      setCurrentIndex((prev) => (prev + 1) % allMedia.length);
    };

    const prevMedia = () => {
      setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
    };

    const isVideo = (url: string) => videos?.includes(url);

    return (
      <div className="relative mt-4">
        <div className="aspect-video bg-furniture-cream rounded-lg overflow-hidden">
          {isVideo(allMedia[currentIndex]) ? (
            <video
              src={allMedia[currentIndex]}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={allMedia[currentIndex]}
              alt="Review media"
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {allMedia.length > 1 && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {allMedia.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id} className="border-furniture-sand hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-furniture-sage rounded-full flex items-center justify-center">
                  {review.userAvatar ? (
                    <Image src={review.userAvatar} alt={review.userName} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <span className="text-white font-medium text-sm">
                      {review.userName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-inter font-medium text-furniture-charcoal">{review.userName}</h4>
                    {review.verified && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDateUTC(review.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <h3 className="font-inter font-semibold text-furniture-darkBrown mb-2">
              {review.title}
            </h3>
            
            <p className="text-furniture-charcoal leading-relaxed mb-4">
              {review.comment}
            </p>

            {(review.images?.length || review.videos?.length) && (
              <MediaCarousel images={review.images} videos={review.videos} />
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-furniture-sand">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleHelpful(review.id)}
                className={`text-sm ${
                  helpfulReviews.has(review.id) 
                    ? 'text-furniture-brown' 
                    : 'text-gray-500 hover:text-furniture-brown'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 mr-1 ${
                  helpfulReviews.has(review.id) ? 'fill-current' : ''
                }`} />
                Helpful ({review.helpful + (helpfulReviews.has(review.id) ? 1 : 0)})
              </Button>
              
              {review.verified && (
                <span className="text-xs text-green-600 font-medium">
                  Verified Purchase
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewDisplay;
