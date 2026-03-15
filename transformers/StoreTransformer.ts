import {
    AddressDTO,
    StoreAvailabilityResponse,
    StoreResponse,
} from '../repository/StoreRepository';
import { StoreCardData } from '../types/store';

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

export class StoreTransformer {
    static toStoreCard(
        store: StoreResponse,
        availability: StoreAvailabilityResponse[],
        now: Date = new Date()
    ): StoreCardData {
        return {
            id: store.storeId,
            storeName: store.storeName,
            vendorName: store.vendorName,
            rating: store.averageRating ?? null,
            address: this.formatAddress(store.address),
            description: store.description,
            email: store.emailId,
            phone: store.phoneNo,
            isOpen: this.isCurrentlyOpen(availability, now),
            nextAvailableSlot: this.getNextAvailableSlot(availability, now),
            availabilitySummary: this.getAvailabilitySummary(availability, now),
        };
    }

    private static formatAddress(address?: AddressDTO): string {
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
        now: Date
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
        now: Date
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

    private static getAvailabilitySummary(
        availability: StoreAvailabilityResponse[],
        now: Date
    ): string {
        const currentDay = WEEK_DAYS[now.getDay()];
        const todaySlots = availability
            .filter(slot => slot.isAvailable && slot.dayOfWeek === currentDay)
            .sort((left, right) => this.toMinutes(left.startTime) - this.toMinutes(right.startTime));

        if (todaySlots.length === 0) {
            return 'Closed today';
        }

        const timeRanges = todaySlots.map(slot =>
            `${this.formatMinutes(this.toMinutes(slot.startTime))} - ${this.formatMinutes(this.toMinutes(slot.endTime))}`
        );

        return `Today: ${timeRanges.join(', ')}`;
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
