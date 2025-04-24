export interface Customer {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt?: Date;
} 