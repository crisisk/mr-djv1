// types.ts
export interface AvailabilityQuery {
    djId: string;
    date: string;
}

export interface AvailabilityResponse {
    available: boolean;
    slots: string[];
}
