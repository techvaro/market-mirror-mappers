export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface Vendor {
  id: string;
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  email?: string;
  category: string;
  description?: string;
  market: string;
  shopNumber: string;
  operatingHours: string;
  registrationNumber?: string;
  taxId?: string;
  status: VerificationStatus;
  createdAt: string;
  location?: ShopLocation;
}

export interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  vendorId?: string;
  vendorName: string;
  market: string;
  assignedDate: string;
  dueDate: string;
  completedDate?: string;
  status: TaskStatus;
  description?: string;
  corrections?: string[];
}

export interface ShopLocation {
  lat: number;
  lng: number;
  accuracy: number;
  address?: string;
  streetName?: string;
  marketBlock?: string;
}

export interface VendorPhoto {
  id: string;
  type: 'front' | 'inside' | 'signboard' | 'products' | 'license' | 'owner_id';
  url: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'approval' | 'rejection' | 'system';
  timestamp: string;
  read: boolean;
}

export interface MapperProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  employeeId: string;
  region: string;
  avatarUrl?: string;
  performanceScore: number;
}
