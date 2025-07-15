import { useState } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";

type Props = {
  serviceData: {
    name: string;
    rating: number;
    reviewCount: number;
    price: string;
    image: string;
    description: string;
  };
};

export default function ServiceDetailInfo({ serviceData }: Props) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);

  return (
    <div className='space-y-6'>
      <img
        src={serviceData.image}
        alt={serviceData.name}
        className='w-full h-64 object-cover rounded-lg'
      />

      <h1 className='text-2xl font-bold text-gray-900'>{serviceData.name}</h1>

      <div className='flex items-center gap-2'>
        <div className='flex items-center'>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(serviceData.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className='text-lg font-semibold text-gray-900'>
          {serviceData.rating}
        </span>
        <span className='text-gray-500'>
          ({serviceData.reviewCount} đánh giá)
        </span>
      </div>

      <div className='text-2xl font-bold text-red-600'>{serviceData.price}</div>

      <div className='border border-gray-200 rounded-lg'>
        <button
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          className='w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors'
        >
          <span className='font-medium text-gray-900'>Mô tả dịch vụ</span>
          {isDescriptionOpen ? (
            <ChevronUp className='w-5 h-5 text-gray-400' />
          ) : (
            <ChevronDown className='w-5 h-5 text-gray-400' />
          )}
        </button>
        {isDescriptionOpen && (
          <div className='px-4 pb-4 text-gray-600 leading-relaxed'>
            {serviceData.description}
          </div>
        )}
      </div>

      <button className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors'>
        Chọn dịch vụ
      </button>
    </div>
  );
}
