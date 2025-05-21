import { User } from "../types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Test User",
    email: "admin@example.com",
    password: "Abc@12345",
    updatedAt: new Date().toISOString(),
  },
];
