export interface DoctorUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
}

export interface Doctor {
  id: string;
  userId: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  clinicName: string;
  ratePerMinute: number;
  isOnline: boolean;
  isBusy: boolean;
  rating: number;
  about?: string;
  user: DoctorUser;
}
