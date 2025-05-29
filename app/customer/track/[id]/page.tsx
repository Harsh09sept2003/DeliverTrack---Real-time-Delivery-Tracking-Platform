"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Phone,
  MessageSquare,
  ArrowLeft,
  Building,
  Home,
} from "lucide-react";
import { Order, Location, TrackingUpdate } from "@/lib/types";
import { mockOrders } from "@/lib/mock-data";

// Dynamically import map component to prevent SSR issues
const OrderTrackingMap = dynamic(() => import("@/components/order-tracking-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-muted flex items-center justify-center">
      <div className="animate-pulse">Loading map...</div>
    </div>
  ),
});

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [deliveryPartnerLocation, setDeliveryPartnerLocation] = useState<Location | null>(null);
  
  useEffect(() => {
    // Find the order by ID
    const foundOrder = mockOrders.find((o) => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
      
      // In a real app, you would subscribe to Socket.IO events for location updates
      // For this demo, we'll simulate location updates with random positions
      
      // Set initial position near pickup location
      setDeliveryPartnerLocation({
        latitude: foundOrder.pickupLocation.latitude + (Math.random() * 0.01 - 0.005),
        longitude: foundOrder.pickupLocation.longitude + (Math.random() * 0.01 - 0.005),
        timestamp: new Date(),
      });
      
      // Simulate movement
      const interval = setInterval(() => {
        setDeliveryPartnerLocation((prev) => {
          if (!prev) return null;
          
          // Move towards delivery location
          const targetLat = foundOrder.deliveryLocation.latitude;
          const targetLng = foundOrder.deliveryLocation.longitude;
          
          const newLat = prev.latitude + (targetLat - prev.latitude) * 0.1;
          const newLng = prev.longitude + (targetLng - prev.longitude) * 0.1;
          
          return {
            latitude: newLat,
            longitude: newLng,
            timestamp: new Date(),
          };
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [orderId]);
  
  if (!order) {
    return (
      <DashboardLayout role="customer\" userName="James Wilson">
        <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The order you're looking for doesn't exist or is no longer available.
            </p>
            <Link href="/customer/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  const getOrderStatusSteps = () => {
    const allSteps = [
      { id: "pending", label: "Order Placed", icon: <Package className="h-5 w-5" /> },
      { id: "accepted", label: "Accepted", icon: <CheckCircle className="h-5 w-5" /> },
      { id: "assigned", label: "Delivery Assigned", icon: <Truck className="h-5 w-5" /> },
      { id: "pickup", label: "Picked Up", icon: <MapPin className="h-5 w-5" /> },
      { id: "in_transit", label: "On the Way", icon: <Truck className="h-5 w-5" /> },
      { id: "delivered", label: "Delivered", icon: <Home className="h-5 w-5" /> },
    ];
    
    // Find the current step index
    const currentStepIndex = allSteps.findIndex((step) => step.id === order.status);
    
    // Mark completed and current steps
    return allSteps.map((step, index) => ({
      ...step,
      status: 
        index < currentStepIndex
          ? "completed"
          : index === currentStepIndex
          ? "current"
          : "upcoming",
    }));
  };
  
  const statusSteps = getOrderStatusSteps();
  
  // Calculate estimated arrival
  const estimatedTime = order.estimatedDeliveryTime 
    ? order.estimatedDeliveryTime 
    : new Date(Date.now() + 30 * 60 * 1000); // Default to 30 min from now
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <DashboardLayout role="customer" userName="James Wilson">
      <div className="space-y-4">
        <div className="flex items-center mb-6">
          <Link href="/customer/dashboard" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Track Order #{order.id.slice(-6)}</h1>
            <p className="text-muted-foreground">
              {order.items.length} items • ${order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/10 pb-2">
            <CardTitle>Live Tracking</CardTitle>
            <CardDescription>
              Watch your delivery in real-time
            </CardDescription>
          </CardHeader>
          <OrderTrackingMap 
            deliveryPartnerLocation={deliveryPartnerLocation}
            pickupLocation={order.pickupLocation}
            deliveryLocation={order.deliveryLocation}
          />
        </Card>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Delivery Status</CardTitle>
              <CardDescription>
                Current status and estimated arrival time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="relative">
                  {statusSteps.map((step, index) => (
                    <div 
                      key={step.id} 
                      className={`
                        flex items-start mb-8 last:mb-0
                        ${step.status === 'completed' || step.status === 'current' ? 'opacity-100' : 'opacity-50'}
                      `}
                    >
                      <div 
                        className={`
                          flex h-10 w-10 shrink-0 items-center justify-center rounded-full mr-4
                          ${step.status === 'completed' ? 'bg-primary text-primary-foreground' : 
                            step.status === 'current' ? 'bg-primary/20 border-2 border-primary text-primary' : 
                            'bg-muted text-muted-foreground'}
                        `}
                      >
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${step.status === 'current' ? 'text-primary' : ''}`}>
                          {step.label}
                        </h3>
                        {step.status === 'completed' && (
                          <p className="text-xs text-muted-foreground">
                            {/* Use the actual timestamp for the step if available */}
                            Completed at {formatTime(new Date(Date.now() - (index + 1) * 10 * 60 * 1000))}
                          </p>
                        )}
                        {step.status === 'current' && (
                          <p className="text-xs">
                            {step.id === 'in_transit' 
                              ? `Arriving around ${formatTime(estimatedTime)}`
                              : 'In progress'}
                          </p>
                        )}
                      </div>
                      {/* Line connecting steps */}
                      {index < statusSteps.length - 1 && (
                        <div 
                          className={`
                            absolute left-5 ml-[0.5px] w-[1px] 
                            ${step.status === 'completed' ? 'bg-primary' : 'bg-muted'}
                          `}
                          style={{ 
                            top: `${index * 6 + 2.5}rem`, 
                            height: '6rem' 
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
              <CardDescription>
                Contact and location information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Delivery Partner
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Alex Driver</div>
                      <div className="text-xs text-muted-foreground">
                        Toyota Prius • ABC123
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Pickup Location
                  </h3>
                  <div className="text-sm">John's Restaurant</div>
                  <div className="text-xs text-muted-foreground">
                    789 Restaurant Ave, New York, NY 10003
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Delivery Location
                  </h3>
                  <div className="text-sm">Home</div>
                  <div className="text-xs text-muted-foreground">
                    123 Main Street, Apt 4B, New York, NY 10001
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Estimated Arrival
                  </h3>
                  <div className="text-sm">
                    {formatTime(estimatedTime)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {order.status === "in_transit" ? "Driver is on the way" : "Waiting for pickup"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}