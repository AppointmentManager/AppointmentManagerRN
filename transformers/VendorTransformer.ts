import { ServiceResponse } from '../repository/ServiceRepository';
import {
    StoreAvailabilityResponse,
    StoreResponse,
} from '../repository/StoreRepository';
import { VendorProfileResponse } from '../repository/VendorRepository';
import { VendorCardData, VendorDetailsData, VendorServiceItem } from '../types/vendor';

type AddressLike = {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
};

const WEEK_DAYS = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
] as const;

const NEXT_SLOT_FALLBACK = 'Availability unavailable';

export class VendorTransformer {
    static toVendorCard(
        vendor: VendorProfileResponse,
        stores: StoreResponse[],
        availability: StoreAvailabilityResponse[]
    ): VendorCardData {
        const primaryStore = stores.find(store => store.isActive) ?? stores[0];

        return {
            id: vendor.vendorId,
            name: vendor.vendorName,
            rating: vendor.averageRating ?? primaryStore?.averageRating ?? null,
            address: this.formatAddress(primaryStore?.address ?? vendor.address),
            category: vendor.category.categoryName,
            description: vendor.description,
            isOpen: this.isCurrentlyOpen(availability),
            nextAvailableSlot: this.getNextAvailableSlot(availability),
        };
    }

    static toVendorDetails(
        vendor: VendorProfileResponse,
        stores: StoreResponse[],
        availability: StoreAvailabilityResponse[],
        services: VendorServiceItem[]
    ): VendorDetailsData {
        return {
            ...this.toVendorCard(vendor, stores, availability),
            email: vendor.emailId,
            phone: vendor.phoneNo,
            gstNumber: vendor.gstNumber,
            services: services.filter(service => service.isActive),
        };
    }

    static toVendorServiceItem(service: ServiceResponse): VendorServiceItem {
        return {
            id: service.serviceId,
            storeId: service.storeId,
            name: service.serviceName,
            price: service.price,
            durationMinutes: service.duration,
            category: service.category.categoryName,
            description: service.description,
            isActive: service.isActive,
        };
    }

    static buildAvailableSlots(
        availability: StoreAvailabilityResponse[],
        durationMinutes: number,
        now: Date = new Date()
    ): string[] {
        const slotStep = Math.max(15, Math.min(durationMinutes, 30));

        for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
            const day = WEEK_DAYS[(now.getDay() + dayOffset) % WEEK_DAYS.length];
            const slotsForDay = availability
                .filter(slot => slot.isAvailable && slot.dayOfWeek === day)
                .sort((left, right) => this.toMinutes(left.startTime) - this.toMinutes(right.startTime));

            const candidateSlots = slotsForDay.flatMap(slot => {
                const startMinutes = this.toMinutes(slot.startTime);
                const endMinutes = this.toMinutes(slot.endTime);
                const earliestStart = dayOffset === 0
                    ? Math.max(startMinutes, now.getHours() * 60 + now.getMinutes())
                    : startMinutes;
                const roundedStart = Math.ceil(earliestStart / slotStep) * slotStep;
                const times: string[] = [];

                for (
                    let cursor = roundedStart;
                    cursor + durationMinutes <= endMinutes;
                    cursor += slotStep
                ) {
                    times.push(this.formatMinutes(cursor));
                }

                return times;
            });

            if (candidateSlots.length > 0) {
                return candidateSlots.slice(0, 12);
            }
        }

        return [];
    }

    private static formatAddress(address?: AddressLike): string {
        if (!address) {
            return 'Address unavailable';
        }

        const parts = [
            address.addressLine1,
            address.addressLine2,
            address.city,
            address.state,
            address.country,
            address.pincode,
        ].filter(Boolean);

        return parts.length > 0 ? parts.join(', ') : 'Address unavailable';
    }

    private static isCurrentlyOpen(
        availability: StoreAvailabilityResponse[],
        now: Date = new Date()
    ): boolean {
        const currentDay = WEEK_DAYS[now.getDay()];
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        return availability.some(slot => {
            if (!slot.isAvailable || slot.dayOfWeek !== currentDay) {
                return false;
            }

            const startMinutes = this.toMinutes(slot.startTime);
            const endMinutes = this.toMinutes(slot.endTime);
            return currentMinutes >= startMinutes && currentMinutes < endMinutes;
        });
    }

    private static getNextAvailableSlot(
        availability: StoreAvailabilityResponse[],
        now: Date = new Date()
    ): string {
        for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
            const day = WEEK_DAYS[(now.getDay() + dayOffset) % WEEK_DAYS.length];
            const slotsForDay = availability
                .filter(slot => slot.isAvailable && slot.dayOfWeek === day)
                .sort((left, right) => this.toMinutes(left.startTime) - this.toMinutes(right.startTime));

            for (const slot of slotsForDay) {
                const startMinutes = this.toMinutes(slot.startTime);
                const nowMinutes = now.getHours() * 60 + now.getMinutes();

                if (dayOffset === 0 && startMinutes <= nowMinutes) {
                    continue;
                }

                return `${this.getRelativeDayLabel(dayOffset, now)}, ${this.formatMinutes(startMinutes)}`;
            }
        }

        return NEXT_SLOT_FALLBACK;
    }

    private static toMinutes(time: string): number {
        const [hours = '0', minutes = '0'] = time.split(':');
        return Number(hours) * 60 + Number(minutes);
    }

    private static formatMinutes(totalMinutes: number): string {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const suffix = hours >= 12 ? 'PM' : 'AM';
        const normalizedHours = hours % 12 || 12;
        return `${normalizedHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
    }

    private static getRelativeDayLabel(dayOffset: number, now: Date): string {
        if (dayOffset === 0) {
            return 'Today';
        }

        if (dayOffset === 1) {
            return 'Tomorrow';
        }

        const targetDay = WEEK_DAYS[(now.getDay() + dayOffset) % WEEK_DAYS.length];
        return targetDay.charAt(0) + targetDay.slice(1).toLowerCase();
    }
}
