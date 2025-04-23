import { db } from '../../config/firebase';
import { 
  collection, 
  getDocs,
  addDoc,
  updateDoc,
  doc,
  DocumentData,
  QueryDocumentSnapshot 
} from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface Airline {
  id: string;
  name: string;
  createdAt: Date;
}

const convertToAirline = (doc: QueryDocumentSnapshot<DocumentData>): Airline => ({
  id: doc.id,
  ...(doc.data() as Omit<Airline, 'id'>),
  createdAt: doc.data().createdAt?.toDate() || new Date()
});

export const airlineService = {
  async getAllAirlines(currentUser: User): Promise<Airline[]> {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      const airlinesRef = collection(db, 'users', currentUser.uid, 'airlines');
      const querySnapshot = await getDocs(airlinesRef);
      return querySnapshot.docs.map(convertToAirline);
    } catch (error: any) {
      throw new Error(`Error fetching airlines: ${error.message}`);
    }
  },

  async addAirline(name: string, currentUser: User): Promise<Airline> {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      const airlineData = {
        name,
        createdAt: new Date()
      };

      const airlinesRef = collection(db, 'users', currentUser.uid, 'airlines');
      const docRef = await addDoc(airlinesRef, airlineData);
      
      return {
        id: docRef.id,
        ...airlineData
      };
    } catch (error: any) {
      throw new Error(`Error adding airline: ${error.message}`);
    }
  },

  async updateAirline(
    airlineId: string, 
    name: string, 
    currentUser: User
  ): Promise<void> {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      const airlineRef = doc(
        db, 
        'users', 
        currentUser.uid, 
        'airlines', 
        airlineId
      );
      await updateDoc(airlineRef, {
        name,
        updatedAt: new Date()
      });
    } catch (error: any) {
      throw new Error(`Error updating airline: ${error.message}`);
    }
  }
}; 