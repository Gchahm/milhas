import { db } from '../../config/firebase';
import { 
  collection, 
  getDocs,
  addDoc,
  updateDoc,
  doc,
  DocumentData,
  QueryDocumentSnapshot,
  setDoc,
  onSnapshot,
  query,
  Unsubscribe,
  Timestamp
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Customer } from '../../models/customer.model'; // Import the Customer model

const USERS_COLLECTION = 'users';
const CUSTOMERS_COLLECTION = 'customers';

const convertToCustomer = (docSnap: QueryDocumentSnapshot<DocumentData>): Customer => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    name: data.name || 'Unknown', // Provide default name
    cpf: data.cpf || '',
    email: data.email || '',
    phone: data.phone || '',
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate()
    // Map other fields if necessary
  };
};

export class CustomerService {
  private static instance: CustomerService;

  private constructor() {}

  static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  subscribeToCustomers(userId: string, callback: (customers: Customer[]) => void): Unsubscribe {
    // Check if subscription already exists
    const customersRef = collection(db, 'users', userId, 'customers');
    const customersQuery = query(customersRef);
    
    return onSnapshot(customersQuery, (snapshot) => {
      const customers = snapshot.docs.map(convertToCustomer);
      callback(customers);
    }, (error) => {
      console.error('Error in customers subscription:', error);
    });

  }

  async initializeUserDocument(user: User): Promise<void> {
    const userDocRef = doc(db, USERS_COLLECTION, user.uid);
    await setDoc(userDocRef, {
      email: user.email,
      createdAt: new Date()
    }, { merge: true });
  }

  async getAllCustomers(currentUser: User): Promise<Customer[]> {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      const customersRef = collection(db, USERS_COLLECTION, currentUser.uid, CUSTOMERS_COLLECTION);
      const querySnapshot = await getDocs(customersRef);
      return querySnapshot.docs.map(convertToCustomer);
    } catch (error: any) {
      throw new Error(`Error fetching customers: ${error.message}`);
    }
  }

  async addCustomer(customerData: Omit<Customer, 'id' | 'createdAt'>, currentUser: User): Promise<void> {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      const customerWithMetadata = {
        ...customerData,
        createdAt: new Date()
      };

      const customersRef = collection(db, 'users', currentUser.uid, 'customers');
      await addDoc(customersRef, customerWithMetadata);
      // No need to return anything as the subscription will handle the update
    } catch (error: any) {
      throw new Error(`Error adding customer: ${error.message}`);
    }
  }

  async updateCustomer(
    customerId: string, 
    customerData: Partial<Omit<Customer, 'id' | 'createdAt'>>, 
    currentUser: User
  ): Promise<void> {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      const customerRef = doc(
        db, 
        'users', 
        currentUser.uid, 
        'customers', 
        customerId
      );
      await updateDoc(customerRef, {
        ...customerData,
        updatedAt: new Date()
      });
      // No need to return anything as the subscription will handle the update
    } catch (error: any) {
      throw new Error(`Error updating customer: ${error.message}`);
    }
  }
}

export const customerService = CustomerService.getInstance(); 