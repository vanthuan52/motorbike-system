interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

export const CategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
}: CategoryFilterProps) => {
  const categories = [
    "Tất cả",
    "Đặt lịch",
    "Bảo dưỡng",
    "Thanh toán",
    "Bảo hành",
    "Dịch vụ",
    "Thông tin",
  ];

  return (
    <div className='mb-8 px-4'>
      <div
        className='
          grid grid-cols-3 gap-3 text-center
          sm:flex sm:flex-wrap sm:justify-center sm:gap-3
        '
      >
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
              selectedCategory === category
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
