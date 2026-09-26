export type PageId =
  | 'home'
  | 'aboutus'
  | 'services'
  | 'massage-style'
  | 'female-massage'
  | 'home-massage'
  | 'testimonials'
  | 'jobs'
  | 'guest'
  | 'contact'
  | 'booking'
  | 'login'
  | 'register';

export interface ServiceItem {
  id: string;
  name: string;
  duration: string;
  description: string;
  recommendedFor?: string;
  icon?: string;
}

export interface PricingTier {
  duration: string;
  price: number;
  formatted: string;
  popular?: boolean;
  badge?: string;
  note?: string;
}

export interface TherapistProfile {
  id: string;
  name: string;
  gender: 'Female' | 'Male';
  age: number;
  experience: string;
  specialties: string[];
  photo: string;
  rating: number;
  reviewsCount: number;
  bio: string;
}

export interface TestimonialItem {
  id: string;
  initials: string;
  quote: string;
  rating?: number;
  service?: string;
  date?: string;
}

export interface BookingData {
  serviceStyle: string;
  duration: string;
  date: string;
  time: string;
  locationType: 'home' | 'hotel' | 'hotel-assist';
  address: string;
  area: string;
  therapistPreference: 'female' | 'male' | 'any';
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
  price: number;
}

export interface AppointmentItem {
  id: string;
  srNo: number;
  therapistName: string;
  therapistId?: string;
  clientName?: string;
  date: string;
  time: string;
  address: string;
  flatNumber: string;
  floorNumber: string;
  streetName: string;
  crossStreetName: string;
  locality: string;
  amount: string;
  status: 'confirmed' | 'pending' | 'rejected';
  bookingDate?: string;
  comments?: string;
}

