import { MapPin } from "lucide-react";

export default function PickupMapSection() {
  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-surface-alt overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3">
        <MapPin size={16} className="text-primary-500 shrink-0" />
        <span className="text-sm font-semibold text-text-primary">
          Địa chỉ cửa hàng: 123 Đường Lớn, Quận 1, TP.HCM
        </span>
      </div>
      <div className="w-full h-52">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d45330.445498399495!2d105.60946185021041!3d9.910945320174955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1746947888113!5m2!1svi!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Vị trí cửa hàng Ant Motor"
        />
      </div>
    </div>
  );
}
