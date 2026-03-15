export interface VendorServiceItem {
    id: number;
    storeId: number;
    name: string;
    price: number;
    durationMinutes: number;
    category: string;
    description?: string;
    isActive: boolean;
}

export interface VendorCardData {
    id: number;
    name: string;
    rating: number | null;
    address: string;
    category: string;
    imageUrl?: string;
    isOpen: boolean;
    nextAvailableSlot: string;
    description?: string;
}

export interface VendorDetailsData extends VendorCardData {
    email: string;
    phone: string;
    gstNumber: string;
    services: VendorServiceItem[];
}
