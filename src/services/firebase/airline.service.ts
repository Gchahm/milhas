import { db } from '../../config/firebase';
import { 
  collection, 
  addDoc,
  updateDoc,
  doc,
  DocumentData,
  QueryDocumentSnapshot,
  onSnapshot,
  query,
  Unsubscribe
} from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface Airline {
  id: string;
  name: string;
  createdAt: Date;
}

const USERS_COLLECTION = 'users';

const convertToAirline = (doc: QueryDocumentSnapshot<DocumentData>): Airline => ({
  id: doc.id,
  ...(doc.data() as Omit<Airline, 'id' | 'createdAt'>),
  createdAt: doc.data().createdAt?.toDate() || new Date()
});

export class AirlineService {
  private static instance: AirlineService;

  private constructor() {}

  static getInstance(): AirlineService {
    if (!AirlineService.instance) {
      AirlineService.instance = new AirlineService();
    }
    return AirlineService.instance;
  }

  subscribeToAirlines(userId: string, callback: (airlines: Airline[]) => void): Unsubscribe {
    const airlinesRef = collection(db, USERS_COLLECTION, userId, 'airlines');
    const airlinesQuery = query(airlinesRef);
    
    return onSnapshot(airlinesQuery, (snapshot) => {
      const airlines = snapshot.docs.map(convertToAirline);
      callback(airlines);
    }, (error) => {
      console.error('Error in airlines subscription:', error);
    });
  }

  async addAirline(name: string, currentUser: User): Promise<void> {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      const airlineData = {
        name,
        createdAt: new Date()
      };

      const airlinesRef = collection(db, USERS_COLLECTION, currentUser.uid, 'airlines');
      await addDoc(airlinesRef, airlineData);
      // No need to return anything as the subscription will handle the update
    } catch (error: any) {
      throw new Error(`Error adding airline: ${error.message}`);
    }
  }

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
        USERS_COLLECTION, 
        currentUser.uid, 
        'airlines', 
        airlineId
      );
      await updateDoc(airlineRef, {
        name,
        updatedAt: new Date()
      });
      // No need to return anything as the subscription will handle the update
    } catch (error: any) {
      throw new Error(`Error updating airline: ${error.message}`);
    }
  }
}

export const airlineService = AirlineService.getInstance(); 