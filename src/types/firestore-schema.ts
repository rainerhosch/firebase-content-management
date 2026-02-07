/**
 * Firestore Schema Type Definitions
 * TypeScript interfaces for Firebase Firestore collections
 */

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
 * Form input types (without id for creation)
 */
export type ChannelFormInput = Omit<Channel, "id"> & { id?: string };
export type DracinFormInput = Omit<Dracin, "id"> & { id?: string };
