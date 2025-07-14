import Link from "next/link";

type RelatedService = {
  id: number;
  name: string;
  slug: string;
  rating: number;
  price: string;
  image: string;
};

type Props = {
  relatedServices: RelatedService[];
};

export default function RelatedServices({ relatedServices }: Props) {
  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>Dịch vụ liên quan</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {relatedServices.map(service => (
          <Link
            key={service.id}
            href={`/dich-vu-cham-soc/${service.slug}`}
            className='flex items-center gap-4 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition'
          >
            <img
              src={service.image}
              alt={service.name}
              className='w-20 h-20 object-cover rounded'
            />
            <div>
              <div className='font-medium text-gray-900'>{service.name}</div>
              <div className='text-sm text-gray-500'>{service.price}</div>
              <div className='text-xs text-yellow-500'>★ {service.rating}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
