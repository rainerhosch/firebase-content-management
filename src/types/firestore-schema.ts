/**
 * Firestore Schema Type Definitions
 * TypeScript interfaces for Firebase Firestore collections
 */

/**
 * Field types for dynamic collection schemas
 */
export type FieldType = "text" | "url" | "textarea" | "select" | "number" | "boolean";

/**
 * Represents a field definition in a collection schema
 */
export interface CollectionField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // For select type
  placeholder?: string;
}

/**
 * Represents a streaming source for a TV channel
 */
export interface Stream {
  name: string;
  url: string;
  description: string;
}

/**
 * Represents a TV Channel with its streaming sources
 * Collection: channels
 */
export interface Channel {
  id: string;
  name: string;
  category: string;
  logo: string;
  streams: Stream[];
}

/**
 * Represents an Asian Drama source
 * Collection: dracin
 */
export interface Dracin {
  id: string;
  name: string;
  image: string;
  description: string;
  status: "aktif" | "nonaktif";
}

/**
 * Collection configuration for dynamic sidebar menu
 * Collection: _collections
 */
export interface CollectionConfig {
  id: string;
  name: string;
  icon: string;
  route: string;
  order: number;
  enabled: boolean;
  fields: CollectionField[];
  isSystem?: boolean; // System collections like channels, dracin, users
}

/**
 * Role-based permissions for menu access
 * Collection: _role_permissions
 */
export interface RolePermission {
  id: string;
  name: string;
  description: string;
  allowedCollections: string[];
}

/**
 * User account for authentication and access control
 * Collection: users
 */
export interface User {
  id: string;
  email: string;
  password: string;
  displayName: string;
  role: string;
  createdAt: Date;
  lastLogin?: Date;
}

/**
 * Generic document for dynamic collections
 */
export interface DynamicDocument {
  id: string;
  [key: string]: unknown;
}

/**
 * Form input types (without id for creation)
 */
export type ChannelFormInput = Omit<Channel, "id"> & { id?: string };
export type DracinFormInput = Omit<Dracin, "id"> & { id?: string };
export type CollectionConfigFormInput = Omit<CollectionConfig, "id"> & { id?: string };
export type RolePermissionFormInput = Omit<RolePermission, "id"> & { id?: string };
export type UserFormInput = Omit<User, "id" | "createdAt" | "lastLogin"> & { id?: string };
