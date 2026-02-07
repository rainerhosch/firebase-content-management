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
    where,
} from "firebase/firestore";
import getFirestoreDb from "./firebase";
import type { Channel, Dracin, CollectionConfig, RolePermission, User, DynamicDocument } from "@/types/firestore-schema";

/**
 * Firestore collection names
 */
const COLLECTIONS = {
    CHANNELS: "channels",
    DRACIN: "dracin",
    COLLECTION_CONFIG: "_collections",
    ROLE_PERMISSIONS: "_role_permissions",
    USERS: "users",
} as const;

/**
 * Simple hash function for password (for demo - use bcrypt in production)
 */
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ============================================
// Channel CRUD Operations
// ============================================

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

// ============================================
// Dracin CRUD Operations
// ============================================

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

// ============================================
// Collection Config CRUD Operations
// ============================================

export async function getCollectionConfigs(): Promise<CollectionConfig[]> {
    const db = getFirestoreDb();
    const configRef = collection(db, COLLECTIONS.COLLECTION_CONFIG);
    const q = query(configRef, orderBy("order"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as CollectionConfig[];
}

export async function getEnabledCollectionConfigs(): Promise<CollectionConfig[]> {
    const db = getFirestoreDb();
    const configRef = collection(db, COLLECTIONS.COLLECTION_CONFIG);
    const snapshot = await getDocs(configRef);

    return snapshot.docs
        .map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }) as CollectionConfig)
        .filter((config) => config.enabled)
        .sort((a, b) => a.order - b.order);
}

export async function createCollectionConfig(data: CollectionConfig): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.COLLECTION_CONFIG, data.id);
    await setDoc(docRef, {
        name: data.name,
        icon: data.icon,
        route: data.route,
        order: data.order,
        enabled: data.enabled,
        fields: data.fields || [],
        isSystem: data.isSystem || false,
    });
}

export async function updateCollectionConfig(id: string, data: Partial<CollectionConfig>): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.COLLECTION_CONFIG, id);
    await updateDoc(docRef, data);
}

export async function deleteCollectionConfig(id: string): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.COLLECTION_CONFIG, id);
    await deleteDoc(docRef);
}

// ============================================
// Role Permission CRUD Operations
// ============================================

export async function getRolePermissions(): Promise<RolePermission[]> {
    const db = getFirestoreDb();
    const rolesRef = collection(db, COLLECTIONS.ROLE_PERMISSIONS);
    const q = query(rolesRef, orderBy("name"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as RolePermission[];
}

export async function getRolePermission(id: string): Promise<RolePermission | null> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.ROLE_PERMISSIONS, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
        return null;
    }

    return { id: snapshot.id, ...snapshot.data() } as RolePermission;
}

export async function createRolePermission(data: RolePermission): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.ROLE_PERMISSIONS, data.id);
    await setDoc(docRef, {
        name: data.name,
        description: data.description,
        allowedCollections: data.allowedCollections,
    });
}

export async function updateRolePermission(id: string, data: Partial<RolePermission>): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.ROLE_PERMISSIONS, id);
    await updateDoc(docRef, data);
}

export async function deleteRolePermission(id: string): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.ROLE_PERMISSIONS, id);
    await deleteDoc(docRef);
}

// ============================================
// User CRUD Operations
// ============================================

export async function getUsers(): Promise<User[]> {
    const db = getFirestoreDb();
    const usersRef = collection(db, COLLECTIONS.USERS);
    const q = query(usersRef, orderBy("displayName"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        password: "********", // Hide password in list
    })) as User[];
}

export async function getUser(id: string): Promise<User | null> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.USERS, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
        return null;
    }

    return { id: snapshot.id, ...snapshot.data() } as User;
}

export async function createUser(data: Omit<User, "createdAt" | "lastLogin">): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.USERS, data.id);
    const hashedPassword = await hashPassword(data.password);

    await setDoc(docRef, {
        email: data.email,
        password: hashedPassword,
        displayName: data.displayName,
        role: data.role,
        createdAt: new Date(),
    });
}

export async function updateUser(id: string, data: Partial<User>): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.USERS, id);

    const updateData: Record<string, unknown> = { ...data };

    // Hash password if provided
    if (data.password && data.password !== "********" && data.password !== "") {
        updateData.password = await hashPassword(data.password);
    } else {
        delete updateData.password;
    }

    await updateDoc(docRef, updateData);
}

export async function deleteUser(id: string): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.USERS, id);
    await deleteDoc(docRef);
}

// ============================================
// Seed Initial Data
// ============================================

export async function seedInitialData(): Promise<void> {
    const db = getFirestoreDb();

    // Check if data already exists
    const configsSnapshot = await getDocs(collection(db, COLLECTIONS.COLLECTION_CONFIG));
    if (!configsSnapshot.empty) {
        return; // Data already seeded
    }

    // Seed collection configs
    const collections: CollectionConfig[] = [
        { id: "channels", name: "Channels", icon: "Tv", route: "/channels", order: 1, enabled: true, fields: [], isSystem: true },
        { id: "dracin", name: "Dracin", icon: "Film", route: "/dracin", order: 2, enabled: true, fields: [], isSystem: true },
        { id: "users", name: "Users", icon: "Users", route: "/users", order: 3, enabled: true, fields: [], isSystem: true },
    ];

    for (const config of collections) {
        await createCollectionConfig(config);
    }

    // Seed role permissions
    const roles: RolePermission[] = [
        { id: "admin", name: "Administrator", description: "Full access to all features", allowedCollections: ["channels", "dracin", "users", "settings"] },
        { id: "editor", name: "Editor", description: "Can edit content collections", allowedCollections: ["channels", "dracin"] },
        { id: "viewer", name: "Viewer", description: "Read-only access", allowedCollections: ["channels", "dracin"] },
    ];

    for (const role of roles) {
        await createRolePermission(role);
    }
}

// ============================================
// Generic Collection CRUD (for dynamic collections)
// ============================================

export async function getCollectionConfig(collectionId: string): Promise<CollectionConfig | null> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.COLLECTION_CONFIG, collectionId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
        return null;
    }

    return { id: snapshot.id, ...snapshot.data() } as CollectionConfig;
}

export async function getDynamicDocuments(collectionName: string): Promise<DynamicDocument[]> {
    const db = getFirestoreDb();
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as DynamicDocument[];
}

export async function getDynamicDocument(collectionName: string, docId: string): Promise<DynamicDocument | null> {
    const db = getFirestoreDb();
    const docRef = doc(db, collectionName, docId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
        return null;
    }

    return { id: snapshot.id, ...snapshot.data() } as DynamicDocument;
}

export async function createDynamicDocument(collectionName: string, data: DynamicDocument): Promise<void> {
    const db = getFirestoreDb();
    const { id, ...documentData } = data;
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, documentData);
}

export async function updateDynamicDocument(collectionName: string, docId: string, data: Partial<DynamicDocument>): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, collectionName, docId);
    const { id, ...updateData } = data;
    await updateDoc(docRef, updateData);
}

export async function deleteDynamicDocument(collectionName: string, docId: string): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
}

