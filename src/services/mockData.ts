import { Task, Vendor, Notification, Message, MapperProfile, TaskStatus } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Data
export const mockProfile: MapperProfile = {
  id: 'm-101',
  name: 'Alex Johnson',
  email: 'alex.j@marketmirror.com',
  phone: '+1 (555) 123-4567',
  employeeId: 'MM-FLD-842',
  region: 'Downtown Metro',
  avatarUrl: 'https://i.pravatar.cc/150?u=alex',
  performanceScore: 94,
};

export const mockTasks: Task[] = [
  {
    id: 't-1',
    title: 'Register New Electronics Vendor',
    priority: 'high',
    vendorId: 'v-3',
    vendorName: 'Tech Hub',
    market: 'Central Market',
    assignedDate: '2023-11-01T08:00:00Z',
    dueDate: '2023-11-01T17:00:00Z',
    status: 'pending',
  },
  {
    id: 't-2',
    title: 'Verify Location for Fresh Groceries',
    priority: 'medium',
    vendorId: 'v-4',
    vendorName: 'Fresh Farms',
    market: 'Westside Bazaar',
    assignedDate: '2023-11-01T09:30:00Z',
    dueDate: '2023-11-02T12:00:00Z',
    status: 'in_progress',
  },
  {
    id: 't-3',
    title: 'Update Photos - Apparel Shop',
    priority: 'low',
    vendorId: 'v-1',
    vendorName: 'Style Street',
    market: 'Downtown Mall',
    assignedDate: '2023-10-31T14:00:00Z',
    dueDate: '2023-11-03T17:00:00Z',
    completedDate: '2023-11-02T15:40:00Z',
    status: 'completed',
  },
  {
    id: 't-5',
    title: 'Register New Grocery Vendor',
    priority: 'medium',
    vendorId: 'v-4',
    vendorName: 'Fresh Farms',
    market: 'Westside Bazaar',
    assignedDate: '2023-10-20T09:00:00Z',
    dueDate: '2023-10-22T17:00:00Z',
    completedDate: '2023-10-21T13:10:00Z',
    status: 'completed',
  },
  {
    id: 't-6',
    title: 'Map Shop Location - Bakehouse',
    priority: 'low',
    vendorId: 'v-6',
    vendorName: 'The Bakehouse',
    market: 'Central Market',
    assignedDate: '2023-10-18T09:00:00Z',
    dueDate: '2023-10-19T17:00:00Z',
    completedDate: '2023-10-18T16:05:00Z',
    status: 'completed',
  },
  {
    id: 't-4',
    title: 'Fix Rejected Submission',
    priority: 'high',
    vendorId: 'v-2',
    vendorName: 'Spice Corner',
    market: 'Eastside Market',
    assignedDate: '2023-10-30T10:00:00Z',
    dueDate: '2023-10-31T17:00:00Z',
    status: 'rejected',
    description: 'Signboard photo is too blurry and the shop location pin is more than 50m from the actual entrance.',
    corrections: [
      'Retake the signboard photo in daylight, ensuring the full business name is legible.',
      'Re-drop the GPS pin standing directly at the shop entrance.',
      'Upload a valid tax ID or registration number if available.',
    ],
  },
  {
    id: 't-7',
    title: 'Fix Rejected Submission - Urban Bites',
    priority: 'medium',
    vendorId: 'v-5',
    vendorName: 'Urban Bites',
    market: 'Downtown Mall',
    assignedDate: '2023-10-25T10:00:00Z',
    dueDate: '2023-10-26T17:00:00Z',
    status: 'rejected',
    description: 'Business license photo was missing and operating hours were left blank.',
    corrections: [
      'Upload a clear photo of the business license or permit.',
      'Confirm and enter accurate daily operating hours.',
    ],
  }
];

export const mockVendors: Vendor[] = [
  {
    id: 'v-1',
    businessName: 'Style Street',
    ownerName: 'Sarah Smith',
    phoneNumber: '555-0101',
    email: 'sarah@stylestreet.com',
    category: 'Apparel',
    description: 'Contemporary clothing and accessories for men and women.',
    market: 'Downtown Mall',
    shopNumber: 'A-12',
    operatingHours: '9AM - 8PM',
    status: 'approved',
    createdAt: '2023-10-15T10:00:00Z',
    location: { lat: 40.7128, lng: -74.0060, accuracy: 5, streetName: 'Mall Concourse', marketBlock: 'Block A' }
  },
  {
    id: 'v-2',
    businessName: 'Spice Corner',
    ownerName: 'Rahul Patel',
    phoneNumber: '555-0102',
    email: 'rahul@spicecorner.com',
    category: 'Food & Groceries',
    description: 'Spices, grains and local produce at wholesale prices.',
    market: 'Eastside Market',
    shopNumber: 'G-45',
    operatingHours: '7AM - 9PM',
    status: 'rejected',
    createdAt: '2023-10-28T11:30:00Z',
    location: { lat: 40.7146, lng: -74.0071, accuracy: 12, streetName: 'Grain Row', marketBlock: 'Block G' }
  },
  {
    id: 'v-3',
    businessName: 'Tech Hub',
    ownerName: 'Mike Chen',
    phoneNumber: '555-0103',
    email: 'mike@techhub.com',
    category: 'Electronics',
    description: 'Phones, accessories and repair services.',
    market: 'Central Market',
    shopNumber: 'E-08',
    operatingHours: '10AM - 7PM',
    status: 'pending',
    createdAt: '2023-11-01T08:15:00Z'
  },
  {
    id: 'v-4',
    businessName: 'Fresh Farms',
    ownerName: 'Grace Adeyemi',
    phoneNumber: '555-0104',
    email: 'grace@freshfarms.com',
    category: 'Food & Groceries',
    description: 'Farm-fresh vegetables and fruit sourced daily.',
    market: 'Westside Bazaar',
    shopNumber: 'B-03',
    operatingHours: '6AM - 6PM',
    status: 'approved',
    createdAt: '2023-10-19T08:00:00Z',
    location: { lat: 40.7218, lng: -74.0110, accuracy: 6, streetName: 'Produce Lane', marketBlock: 'Block B' }
  },
  {
    id: 'v-5',
    businessName: 'Urban Bites',
    ownerName: 'Daniel Okafor',
    phoneNumber: '555-0105',
    email: 'daniel@urbanbites.com',
    category: 'Food & Groceries',
    description: 'Fast casual meals and snacks for mall shoppers.',
    market: 'Downtown Mall',
    shopNumber: 'C-21',
    operatingHours: '',
    status: 'rejected',
    createdAt: '2023-10-24T09:20:00Z'
  },
  {
    id: 'v-6',
    businessName: 'The Bakehouse',
    ownerName: 'Amaka Obi',
    phoneNumber: '555-0106',
    email: 'amaka@bakehouse.com',
    category: 'Food & Groceries',
    description: 'Artisan bread, pastries and cakes baked fresh daily.',
    market: 'Central Market',
    shopNumber: 'F-14',
    operatingHours: '6AM - 7PM',
    status: 'approved',
    createdAt: '2023-10-17T07:45:00Z',
    location: { lat: 40.7135, lng: -74.0050, accuracy: 4, streetName: 'Bakers Row', marketBlock: 'Block F' }
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n-1',
    title: 'New Assignment',
    message: 'You have been assigned to register Tech Hub.',
    type: 'assignment',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    read: false,
  },
  {
    id: 'n-2',
    title: 'Submission Approved',
    message: 'Style Street registration has been approved.',
    type: 'approval',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: true,
  },
  {
    id: 'n-3',
    title: 'Submission Rejected',
    message: 'Spice Corner needs new photos.',
    type: 'rejection',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
  }
];

// Service functions
export const taskService = {
  getTasks: async () => {
    await delay(500);
    return mockTasks;
  },
  getTaskById: async (id: string) => {
    await delay(300);
    return mockTasks.find(t => t.id === id);
  },
  updateTaskStatus: async (id: string, status: TaskStatus) => {
    await delay(400);
    const task = mockTasks.find(t => t.id === id);
    if (task) task.status = status;
    return task;
  }
};

export const vendorService = {
  getVendors: async () => {
    await delay(500);
    return mockVendors;
  },
  getVendorById: async (id: string) => {
    await delay(300);
    return mockVendors.find(v => v.id === id);
  },
  createVendor: async (data: Partial<Vendor>) => {
    await delay(800);
    const newVendor: Vendor = {
      ...data,
      id: `v-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    } as Vendor;
    mockVendors.push(newVendor);
    return newVendor;
  },
  updateVendorStatus: async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    await delay(600);
    const vendor = mockVendors.find(v => v.id === id);
    if (vendor) {
      vendor.status = status;
      if (notes) {
        vendor.description = vendor.description
          ? vendor.description
          : notes;
      }
    }
    return vendor;
  }
};

export const profileService = {
  getProfile: async () => {
    await delay(200);
    return mockProfile;
  }
};

export const notificationService = {
  getNotifications: async () => {
    await delay(300);
    return mockNotifications;
  },
  markAsRead: async (id: string) => {
    await delay(100);
    const notif = mockNotifications.find(n => n.id === id);
    if (notif) notif.read = true;
    return notif;
  },
  markAllAsRead: async () => {
    await delay(300);
    mockNotifications.forEach(n => { n.read = true; });
    return mockNotifications;
  }
};
