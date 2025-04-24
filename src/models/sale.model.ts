export interface Sale {
  id: string;
  date: Date;        // Use Date object for proper handling
  customerId: string; // ID referencing a customer
  airlineId: string;  // <-- Add this line
  value: number;       // Total sale value
  cost: number;        // Cost of goods sold
  createdAt: Date;
  updatedAt?: Date;  // Optional: track updates
} 