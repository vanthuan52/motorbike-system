import Link from "next/link";
import { Star } from "lucide-react";

interface Service {
  slug: string;
  image: string;
  name: string;
  rating: number;
  price: string | number;
}

interface ServiceCardProps {
  service: Service;
  layout: "list" | "grid";
}

const formatPrice = (price: string | number) =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";

export default function ServiceCard({ service, layout }: ServiceCardProps) {
  return (
    <Link
      href={`/dich-vu-cham-soc/${service.slug}`}
      title={`Xem chi tiết ${service.name}`}
      className='group'
    >
      <div
        className={`bg-white rounded-lg shadow p-4 hover:shadow-lg transition-all duration-200 
          ${layout === "list" ? "flex gap-4" : ""} hover:scale-[1.02]`}
      >
        <img
          src={service.image}
          alt={service.name}
          className={
            layout === "list"
              ? "w-32 h-32 object-cover rounded"
              : "w-full h-40 object-cover rounded"
          }
          loading='lazy'
        />
        <div className={layout === "list" ? "flex-1" : ""}>
          <h3 className='font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors'>
            {service.name}
          </h3>
          <div className='flex items-center gap-1 mb-2'>
            <Star className='w-4 h-4 text-yellow-400 fill-current' />
            <span className='text-sm text-gray-900'>{service.rating}</span>
          </div>
          <div className='text-red-600 font-bold'>
            {typeof service.price === "number" ||
            /^\d+$/.test(service.price.toString())
              ? formatPrice(service.price)
              : service.price}
          </div>
        </div>
      </div>
    </Link>
  );
}
