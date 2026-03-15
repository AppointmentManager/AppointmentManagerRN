export interface StoreCardData {
    id: number;
    storeName: string;
    vendorName: string;
    rating: number | null;
    address: string;
    description?: string;
    email: string;
    phone: string;
    isOpen: boolean;
    nextAvailableSlot: string;
    availabilitySummary: string;
}
