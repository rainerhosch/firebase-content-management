
import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
} from "firebase/firestore";
import getFirestoreDb from "./firebase";
import type { Channel, Dracin } from "@/types/firestore-schema";

/**
 * Firestore collection names
 */
const COLLECTIONS = {
    CHANNELS: "channels",
    DRACIN: "dracin",
} as const;

/**
 * Channel CRUD Operations
 */

export async function getChannels(): Promise<Channel[]> {
    const db = getFirestoreDb();
    const channelsRef = collection(db, COLLECTIONS.CHANNELS);
    const q = query(channelsRef, orderBy("name"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Channel[];
}

export async function getChannel(id: string): Promise<Channel | null> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.CHANNELS, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
        return null;
    }

    return { id: snapshot.id, ...snapshot.data() } as Channel;
}

export async function createChannel(data: Channel): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.CHANNELS, data.id);
    await setDoc(docRef, {
        name: data.name,
        category: data.category,
        logo: data.logo,
        streams: data.streams,
    });
}

export async function updateChannel(id: string, data: Partial<Channel>): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.CHANNELS, id);
    await updateDoc(docRef, data);
}

export async function deleteChannel(id: string): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.CHANNELS, id);
    await deleteDoc(docRef);
}

/**
 * Dracin CRUD Operations
 */

export async function getDracins(): Promise<Dracin[]> {
    const db = getFirestoreDb();
    const dracinRef = collection(db, COLLECTIONS.DRACIN);
    const q = query(dracinRef, orderBy("name"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Dracin[];
}

export async function getDracin(id: string): Promise<Dracin | null> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.DRACIN, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
        return null;
    }

    return { id: snapshot.id, ...snapshot.data() } as Dracin;
}

export async function createDracin(data: Dracin): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.DRACIN, data.id);
    await setDoc(docRef, {
        name: data.name,
        image: data.image,
        description: data.description,
        status: data.status,
    });
}

export async function updateDracin(id: string, data: Partial<Dracin>): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.DRACIN, id);
    await updateDoc(docRef, data);
}

export async function deleteDracin(id: string): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.DRACIN, id);
    await deleteDoc(docRef);
}
