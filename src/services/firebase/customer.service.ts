import { db } from '../../config/firebase';
import { 
  collection, 
  getDocs,
  addDoc,
  updateDoc,
  doc,
  DocumentData,
  QueryDocumentSnapshot,
  setDoc
} from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface Customer {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  createdAt: Date;
}

const USERS_COLLECTION = 'users';

const convertToCustomer = (doc: QueryDocumentSnapshot<DocumentData>): Customer => ({
  id: doc.id,
  ...(doc.data() as Omit<Customer, 'id'>),
  createdAt: doc.data().createdAt?.toDate() || new Date()
});

export const customerService = {
  async initializeUserDocument(user: User): Promise<void> {
    const userDocRef = doc(db, USERS_COLLECTION, user.uid);
    await setDoc(userDocRef, {
      email: user.email,
      createdAt: new Date()
    }, { merge: true });
  },

  async getAllCustomers(currentUser: User): Promise<Customer[]> {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      const customersRef = collection(db, USERS_COLLECTION, currentUser.uid, 'customers');
      const querySnapshot = await getDocs(customersRef);
      return querySnapshot.docs.map(convertToCustomer);
    } catch (error: any) {
      throw new Error(`Error fetching customers: ${error.message}`);
    }
  },

  async addCustomer(customerData: Omit<Customer, 'id' | 'createdAt'>, currentUser: User): Promise<Customer> {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      const customerWithMetadata = {
        ...customerData,
        createdAt: new Date()
      };

      const customersRef = collection(db, USERS_COLLECTION, currentUser.uid, 'customers');
      const docRef = await addDoc(customersRef, customerWithMetadata);
      
      return {
        id: docRef.id,
        ...customerWithMetadata
      };
    } catch (error: any) {
      throw new Error(`Error adding customer: ${error.message}`);
    }
  },

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
    } catch (error: any) {
      throw new Error(`Error updating customer: ${error.message}`);
    }
  }
}; 