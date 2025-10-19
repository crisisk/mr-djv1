// models/Booking.ts
export interface Booking {
    djId: string;
    eventDate: Date;
    eventName: string;
    clientName: string;
    clientEmail: string;
    notes?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BookingRequest {
    djId: string;
    eventDate: string;
    eventName: string;
    clientName: string;
    clientEmail: string;
    notes?: string;
}
