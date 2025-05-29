// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "vendor" | "partner" | "customer";
  createdAt: Date;
}

export interface Vendor extends User {
  role: "vendor";
  businessName: string;
  address: string;
  phone: string;
}

export interface DeliveryPartner extends User {
  role: "partner";
  phone: string;
  vehicle: string;
  isOnline: boolean;
  currentLocation?: Location;
  currentOrderId?: string;
}

export interface Customer extends User {
  role: "customer";
  phone: string;
  address: string;
}

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
  heading?: number;
  speed?: number;
}

// Order Types
export interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  partnerId?: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  pickupLocation: Location;
  deliveryLocation: Location;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  trackingUpdates: TrackingUpdate[];
}

export type OrderStatus = 
  | "pending" 
  | "accepted" 
  | "assigned" 
  | "pickup" 
  | "in_transit" 
  | "delivered" 
  | "cancelled";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface TrackingUpdate {
  id: string;
  orderId: string;
  status: OrderStatus;
  location?: Location;
  timestamp: Date;
  message: string;
}

// Socket Event Types
export type SocketEvent = 
  | "location_update"
  | "order_status_update"
  | "new_order"
  | "order_assigned"
  | "partner_online"
  | "partner_offline";

export interface LocationUpdateEvent {
  partnerId: string;
  orderId?: string;
  location: Location;
}

export interface OrderStatusUpdateEvent {
  orderId: string;
  status: OrderStatus;
  location?: Location;
  message: string;
}