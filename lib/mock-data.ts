import { Order, OrderStatus, OrderItem, TrackingUpdate } from "@/lib/types";

// Function to generate a random order ID
const generateOrderId = () => {
  return Math.random().toString(36).substring(2, 10);
};

// Function to generate a random location within NYC area
const generateRandomLocation = (base: { lat: number; lng: number }, variance = 0.01) => {
  return {
    latitude: base.lat + (Math.random() * variance * 2 - variance),
    longitude: base.lng + (Math.random() * variance * 2 - variance),
    timestamp: new Date(),
  };
};

// NYC area base coordinates
const nycBase = { lat: 40.7128, lng: -74.0060 };

// Function to generate random order items
const generateOrderItems = (count: number): OrderItem[] => {
  const items = [
    { name: "Burger", price: 9.99 },
    { name: "Pizza", price: 12.99 },
    { name: "Salad", price: 7.99 },
    { name: "Pasta", price: 14.99 },
    { name: "Sandwich", price: 8.99 },
    { name: "Soda", price: 2.49 },
    { name: "Coffee", price: 3.99 },
    { name: "Dessert", price: 6.99 },
  ];
  
  const result: OrderItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomItem = items[Math.floor(Math.random() * items.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    
    result.push({
      id: generateOrderId(),
      name: randomItem.name,
      quantity,
      price: randomItem.price,
    });
  }
  
  return result;
};

// Function to generate tracking updates for an order
const generateTrackingUpdates = (
  orderId: string, 
  status: OrderStatus,
  createdAt: Date
): TrackingUpdate[] => {
  const updates: TrackingUpdate[] = [];
  const statuses: OrderStatus[] = ["pending", "accepted", "assigned", "pickup", "in_transit", "delivered"];
  
  const currentStatusIndex = statuses.indexOf(status);
  
  // Generate updates for all statuses up to the current one
  for (let i = 0; i <= currentStatusIndex; i++) {
    if (i === statuses.length) break; // Skip if we've reached the end
    
    const currentStatus = statuses[i];
    const timestamp = new Date(createdAt.getTime() + i * 15 * 60 * 1000); // 15 min increments
    
    updates.push({
      id: generateOrderId(),
      orderId,
      status: currentStatus,
      timestamp,
      message: `Order ${currentStatus.replace("_", " ")}`,
    });
  }
  
  return updates;
};

// Generate mock orders
export const mockOrders: Order[] = [
  // Active in-transit order
  {
    id: "order1" + generateOrderId(),
    customerId: "customer1",
    vendorId: "vendor1",
    partnerId: "partner1",
    status: "in_transit",
    items: generateOrderItems(3),
    totalAmount: 36.97,
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    updatedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    pickupLocation: generateRandomLocation(nycBase),
    deliveryLocation: generateRandomLocation(nycBase),
    estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000), // 15 min from now
    trackingUpdates: [],
  },
  
  // Pending order
  {
    id: "order2" + generateOrderId(),
    customerId: "customer1",
    vendorId: "vendor2",
    status: "pending",
    items: generateOrderItems(2),
    totalAmount: 22.98,
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    updatedAt: new Date(Date.now() - 15 * 60 * 1000),
    pickupLocation: generateRandomLocation(nycBase),
    deliveryLocation: generateRandomLocation(nycBase),
    trackingUpdates: [],
  },
  
  // Accepted order ready for assignment
  {
    id: "order3" + generateOrderId(),
    customerId: "customer2",
    vendorId: "vendor1",
    status: "accepted",
    items: generateOrderItems(4),
    totalAmount: 45.96,
    createdAt: new Date(Date.now() - 40 * 60 * 1000), // 40 min ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    pickupLocation: generateRandomLocation(nycBase),
    deliveryLocation: generateRandomLocation(nycBase),
    trackingUpdates: [],
  },
  
  // Assigned order
  {
    id: "order4" + generateOrderId(),
    customerId: "customer3",
    vendorId: "vendor3",
    partnerId: "partner2",
    status: "assigned",
    items: generateOrderItems(1),
    totalAmount: 12.99,
    createdAt: new Date(Date.now() - 25 * 60 * 1000), // 25 min ago
    updatedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    pickupLocation: generateRandomLocation(nycBase),
    deliveryLocation: generateRandomLocation(nycBase),
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 min from now
    trackingUpdates: [],
  },
  
  // Delivered order
  {
    id: "order5" + generateOrderId(),
    customerId: "customer1",
    vendorId: "vendor2",
    partnerId: "partner1",
    status: "delivered",
    items: generateOrderItems(3),
    totalAmount: 38.96,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    pickupLocation: generateRandomLocation(nycBase),
    deliveryLocation: generateRandomLocation(nycBase),
    estimatedDeliveryTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    actualDeliveryTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    trackingUpdates: [],
  },
  
  // Cancelled order
  {
    id: "order6" + generateOrderId(),
    customerId: "customer2",
    vendorId: "vendor1",
    status: "cancelled",
    items: generateOrderItems(2),
    totalAmount: 16.98,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    updatedAt: new Date(Date.now() - 4.8 * 60 * 60 * 1000), // 4.8 hours ago
    pickupLocation: generateRandomLocation(nycBase),
    deliveryLocation: generateRandomLocation(nycBase),
    trackingUpdates: [],
  },
  
  // Another delivered order
  {
    id: "order7" + generateOrderId(),
    customerId: "customer1",
    vendorId: "vendor3",
    partnerId: "partner2",
    status: "delivered",
    items: generateOrderItems(1),
    totalAmount: 9.99,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
    pickupLocation: generateRandomLocation(nycBase),
    deliveryLocation: generateRandomLocation(nycBase),
    estimatedDeliveryTime: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
    actualDeliveryTime: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
    trackingUpdates: [],
  },
];

// Add tracking updates to all orders
mockOrders.forEach(order => {
  order.trackingUpdates = generateTrackingUpdates(order.id, order.status, order.createdAt);
});