// types.ts
export interface BookingFormData {
  // Step 1: Event Details
  eventDate: string;
  eventType: 'wedding' | 'birthday' | 'corporate' | 'other';
  eventLocation: string;
  
  // Step 2: Music Preferences
  musicGenres: string[];
  specialSongs: string[];
  
  // Step 3: Equipment
  needsEquipment: boolean;
  equipmentItems: string[];
  
  // Step 4: Personal Details
  fullName: string;
  email: string;
  phone: string;
  
  // Step 5: Confirmation
  termsAccepted: boolean;
  notes: string;
}

export interface StepProps {
  data: BookingFormData;
  onUpdate: (field: keyof BookingFormData, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  errors: Record<string, string>;
}
