import { db } from '../../config/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  DocumentData,
  QueryDocumentSnapshot,
  onSnapshot,
  query,
  Timestamp,
  orderBy,
  Unsubscribe,
  DocumentReference
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Sale } from '../../models/sale.model';

const USERS_COLLECTION = 'users';
const SALES_COLLECTION = 'sales';
const CUSTOMERS_COLLECTION = 'customers';
const AIRLINES_COLLECTION = 'airlines';

const convertToSale = (docSnap: QueryDocumentSnapshot<DocumentData>): Sale => {
  const data = docSnap.data();
  const customerRef = data.customerId as DocumentReference | undefined;
  const airlineRef = data.airlineId as DocumentReference | undefined;

  return {
    id: docSnap.id,
    date: (data.date as Timestamp)?.toDate() || new Date(),
    customerId: customerRef?.id || '',
    airlineId: airlineRef?.id || '',
    value: data.value || 0,
    cost: data.cost || 0,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate()
  };
};

type SaleInputData = Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>;

export class SaleService {
  private static instance: SaleService;

  private constructor() {}

  static getInstance(): SaleService {
    if (!SaleService.instance) {
      SaleService.instance = new SaleService();
    }
    return SaleService.instance;
  }

  private getDocRef(collectionName: string, userId: string, docId: string): DocumentReference {
    return doc(db, USERS_COLLECTION, userId, collectionName, docId);
  }

  subscribeToSales(userId: string, callback: (sales: Sale[]) => void, onError: (error: Error) => void): Unsubscribe {
    try {
        const salesRef = collection(db, USERS_COLLECTION, userId, SALES_COLLECTION);
        const salesQuery = query(salesRef, orderBy('date', 'desc'));

        return onSnapshot(salesQuery, (snapshot) => {
            const sales = snapshot.docs.map(convertToSale);
            callback(sales);
        }, (error) => {
            console.error('Error in sales subscription:', error);
            onError(new Error('Failed to subscribe to sales updates.'));
        });
    } catch (error) {
        console.error('Error setting up sales subscription:', error);
        onError(new Error('Error setting up sales subscription.'));
        return () => {};
    }
  }

  async addSale(saleData: SaleInputData, currentUser: User): Promise<string> {
    if (!currentUser) {
      throw new Error('User not authenticated.');
    }
    if (!saleData.customerId || !saleData.airlineId) {
        throw new Error('Customer ID and Airline ID are required.');
    }
    try {
      const salesRef = collection(db, USERS_COLLECTION, currentUser.uid, SALES_COLLECTION);
      const docData = {
        customerId: this.getDocRef(CUSTOMERS_COLLECTION, currentUser.uid, saleData.customerId),
        airlineId: this.getDocRef(AIRLINES_COLLECTION, currentUser.uid, saleData.airlineId),
        date: Timestamp.fromDate(saleData.date),
        value: saleData.value,
        cost: saleData.cost,
        createdAt: Timestamp.now()
      };
      const docRef = await addDoc(salesRef, docData);
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding sale:', error);
      throw new Error(`Error adding sale: ${error.message || 'Unknown error'}`);
    }
  }

  async updateSale(saleId: string, saleData: Partial<SaleInputData>, currentUser: User): Promise<void> {
    if (!currentUser) {
      throw new Error('User not authenticated.');
    }
    try {
      const saleRef = doc(db, USERS_COLLECTION, currentUser.uid, SALES_COLLECTION, saleId);
      const updateData: { [key: string]: any } = {
          updatedAt: Timestamp.now()
      };

      if (saleData.customerId) {
        updateData.customerId = this.getDocRef(CUSTOMERS_COLLECTION, currentUser.uid, saleData.customerId);
      }
      if (saleData.airlineId) {
        updateData.airlineId = this.getDocRef(AIRLINES_COLLECTION, currentUser.uid, saleData.airlineId);
      }
      if (saleData.date) {
        updateData.date = Timestamp.fromDate(saleData.date);
      }
      if (saleData.value !== undefined) updateData.value = saleData.value;
      if (saleData.cost !== undefined) updateData.cost = saleData.cost;

      await updateDoc(saleRef, updateData);
    } catch (error: any) {
      console.error('Error updating sale:', error);
      throw new Error(`Error updating sale: ${error.message || 'Unknown error'}`);
    }
  }

  async deleteSale(saleId: string, currentUser: User): Promise<void> {
    if (!currentUser) {
      throw new Error('User not authenticated.');
    }
    try {
      const saleRef = doc(db, USERS_COLLECTION, currentUser.uid, SALES_COLLECTION, saleId);
      await deleteDoc(saleRef);
    } catch (error: any) {
      console.error('Error deleting sale:', error);
      throw new Error(`Error deleting sale: ${error.message || 'Unknown error'}`);
    }
  }
}

export const saleService = SaleService.getInstance(); 