import Link from "next/link";
import { usePathname } from "next/navigation";
import { Filter, Menu, X } from "lucide-react";
import { useState } from "react";

const SERVICE_TYPES = [
  { label: "Đại tu động cơ", value: "dai-tu-dong-co" },
  { label: "Sơn-xi-dọn mới", value: "son-xi-don-moi" },
  { label: "Bảo dưỡng", value: "bao-duong" },
  { label: "Sửa chữa", value: "sua-chua" },
];

export default function ServiceFilter() {
  const pathname = usePathname();
  const current = pathname.split("/").pop();
  const [open, setOpen] = useState(false);

  const sidebarContent = (
    <div>
      <div className='flex flex-col gap-3'>
        {SERVICE_TYPES.map(type => (
          <Link
            key={type.value}
            href={`/dich-vu-cham-soc/${type.value}`}
            className={`px-4 py-2 rounded-lg text-left transition-colors font-medium
            ${current === type.value ? "bg-primary-100 text-text-primary" : "text-text-secondary"}
            hover:bg-secondary-100
          `}
            onClick={() => setOpen(false)}
          >
            {type.label}
          </Link>
        ))}
      </div>
    </div>
  );
  return (
    <>
      <button
        className='lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg mb-2 sm:mb-3 lg:mb-4'
        onClick={() => setOpen(true)}
        aria-label='Mở bộ lọc loại dịch vụ'
      >
        <Menu className='w-5 h-5' />
        <span className='font-medium'>Loại dịch vụ</span>
      </button>

      <div className='hidden lg:block'>{sidebarContent}</div>

      {/* Drawer cho mobile/tablet */}
      {open && (
        <div className='fixed inset-0 z-40 flex pt-20 sm:pt-24 lg:pt-28'>
          {/* Overlay */}
          <div
            className='fixed inset-0 bg-black/30'
            onClick={() => setOpen(false)}
          />
          {/* Drawer content */}
          <div className='relative z-50 w-4/5 max-w-xs bg-surface h-full shadow-[var(--shadow-lg)] px-0 pb-0 animate-slide-in-left'>
            <div className='px-4 pt-6 pb-6'>
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-2'>
                  <Filter className='w-5 h-5 text-text-secondary' />
                  <h3 className='text-lg font-semibold text-text-primary'>
                    Loại dịch vụ
                  </h3>
                </div>
                <button
                  className='p-2 rounded hover:bg-surface-alt'
                  onClick={() => setOpen(false)}
                  aria-label='Đóng bộ lọc'
                  type='button'
                >
                  <X className='w-6 h-6 text-text-muted' />
                </button>
              </div>
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
