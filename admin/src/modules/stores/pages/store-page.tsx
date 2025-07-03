import PageInfo from "@/components/page-info";
import StoreList from "./store-list";

export default function StorePage() {
  return (
    <div className='w-full min-h-full'>
      <div className='px-4 py-3 flex flex-col gap-3'>
        <PageInfo name='Danh sách cửa hàng' />
        <StoreList />
      </div>
    </div>
  );
}
