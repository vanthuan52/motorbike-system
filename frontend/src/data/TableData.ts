export const mockDataTable = [
  {
    id: 1,
    name: "Yamaha",
    description: "Đây là hãng xe Yamaha",
    status: false,
  },
  {
    id: 2,
    name: "Honda",
    description: "Đây là hãng xe Honda",
    status: true,
  },
  {
    id: 3,
    name: "Suzuki",
    description: "Đây là hãng xe Suzuki",
    status: true,
  },
  {
    id: 4,
    name: "SYM",
    description: "Đây là hãng xe SYM",
    status: true,
  },
  {
    id: 5,
    name: "Ducati",
    description: "Đây là hãng xe Ducati",
    status: true,
  },
];

export const mockDataTableVehicleType = [
  {
    id: 1,
    company_id: 1,
    name: "Xe tay ga",
    description: "Đây là loại xe tay ga",
    status: true,
  },
  {
    id: 2,
    company_id: 2,
    name: "Xe số",
    description: "Đây là loại xe số",
    status: true,
  },
  {
    id: 3,
    company_id: 3,
    name: "Xe côn tay",
    description: "Đây là loại xe côn tay",
    status: false,
  },
  {
    id: 4,
    company_id: 4,
    name: "Xe điện",
    description: "Đây là loại xe điện",
    status: true,
  },
];

export const mockDataTableVehiclePart = [
  {
    id: 1,
    vehicle_type_id: 1,
    name: "Xe tay ga",
    code: "Xe tay ga",
    average_life: 10000,
    unit_price: 100000,
    quantity: 100,
    status: true,
    image: "https://example.com/image1.jpg",
  },
  {
    id: 2,
    vehicle_type_id: 2,
    name: "Xe số",
    code: "Xe số",
    average_life: 20000,
    unit_price: 200000,
    quantity: 200,
    status: true,
    image: "https://example.com/image2.jpg",
  },
  {
    id: 3,
    vehicle_type_id: 3,
    name: "Xe côn tay",
    code: "Xe côn tay",
    average_life: 30000,
    unit_price: 300000,
    quantity: 300,
    status: false,
    image: "https://example.com/image3.jpg",
  },
  {
    id: 4,
    vehicle_type_id: 4,
    name: "Xe điện",
    code: "Xe điện",
    average_life: 40000,
    unit_price: 400000,
    quantity: 400,
    status: true,
    image: "https://example.com/image4.jpg",
  },
  {
    id: 5,
    vehicle_type_id: 5,
    name: "Xe tay ga",
    code: "Xe tay ga",
    average_life: 50000,
    unit_price: 500000,
    quantity: 500,
    status: true,
    image: "https://example.com/image5.jpg",
  },
];

export const mockDataTableMaintenance = [
  {
    id: 1,
    customer: "Nguyễn Văn A",
    phone: "0123456789",
    staff: {
      id: 1,
      name: "Nguyễn Văn B",
      phone: "0987654321",
      email: "b@c.com",
    },
    maintenance_date: "2023-10-01",
    total_cost: 1000000,
    status: "Đã hoàn thành",
  },

  {
    id: 2,
    customer: "Nguyễn Văn A",
    phone: "0123456789",
    staff: {
      id: 2,
      name: "Trần Thị D",
      phone: "0987654321",
      email: "d@e.com",
    },
    maintenance_date: "2023-10-02",
    total_cost: 2000000,
    status: "Chưa hoàn thành",
  },

  {
    id: 3,
    customer: "Nguyễn Văn A",
    phone: "0123456789",
    staff: {
      id: 3,
      name: "Nguyễn Văn F",
      phone: "0987654321",
      email: "f@g.com",
    },
    maintenance_date: "2023-10-03",
    total_cost: 3000000,
    status: "Đã hoàn thành",
  },

  {
    id: 4,
    customer: "Nguyễn Văn A",

    phone: "0123456789",
    staff: {
      id: 4,
      name: "Nguyễn Văn H",
      phone: "0987654321",
      email: "h@i.com",
    },
    maintenance_date: "2023-10-04",
    total_cost: 4000000,
    status: "Chưa hoàn thành",
  },
  {
    id: 5,
    customer: "Nguyễn Văn A",

    phone: "0123456789",
    staff: {
      id: 5,
      name: "Nguyễn Văn J",
      phone: "0987654321",
      email: "j@k.com",
    },
    maintenance_date: "2023-10-05",
    total_cost: 5000000,
    status: "Đã hoàn tính",
  },
];
