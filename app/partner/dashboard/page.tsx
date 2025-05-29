"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Package,
  MapPin,
  Navigation,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
} from "lucide-react";
import { Order, OrderStatus } from "@/lib/types";
import { mockOrders } from "@/lib/mock-data";
import Link from "next/link";

export default function PartnerDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    // Filter orders that are in "assigned" status for this partner
    const assigned = mockOrders.filter(
      (order) => order.status === "assigned" || order.status === "pickup" || order.status === "in_transit"
    );
    
    if (assigned.length > 0) {
      setCurrentOrder(assigned[0]);
    }
    
    // Filter orders that are in "accepted" status (ready to be assigned)
    const available = mockOrders.filter((order) => order.status === "accepted");
    setAvailableOrders(available);
  }, []);
  
  const getStatusSteps = () => {
    const steps = [
      { id: "assigned", label: "Assigned", icon: <Package /> },
      { id: "pickup", label: "Pickup", icon: <MapPin /> },
      { id: "in_transit", label: "In Transit", icon: <Navigation /> },
      { id: "delivered", label: "Delivered", icon: <CheckCircle /> },
    ];
    
    if (!currentOrder) return steps;
    
    // Find the current step index
    const currentStepIndex = steps.findIndex((step) => step.id === currentOrder.status);
    
    // Mark completed and current steps
    return steps.map((step, index) => ({
      ...step,
      status: 
        index < currentStepIndex
          ? "completed"
          : index === currentStepIndex
          ? "current"
          : "upcoming",
    }));
  };
  
  const statusSteps = getStatusSteps();
  
  const handleStatusUpdate = (newStatus: OrderStatus) => {
    if (!currentOrder) return;
    
    // In a real app, this would make an API call
    setCurrentOrder({
      ...currentOrder,
      status: newStatus,
      trackingUpdates: [
        ...currentOrder.trackingUpdates,
        {
          id: Math.random().toString(36).substring(7),
          orderId: currentOrder.id,
          status: newStatus,
          timestamp: new Date(),
          message: `Order ${newStatus.replace("_", " ")}`,
        },
      ],
    });
  };
  
  const getNextStatus = (): OrderStatus | null => {
    if (!currentOrder) return null;
    
    switch (currentOrder.status) {
      case "assigned":
        return "pickup";
      case "pickup":
        return "in_transit";
      case "in_transit":
        return "delivered";
      default:
        return null;
    }
  };
  
  const nextStatus = getNextStatus();
  
  const formatNextAction = () => {
    if (!nextStatus) return "";
    
    switch (nextStatus) {
      case "pickup":
        return "Confirm Pickup";
      case "in_transit":
        return "Start Delivery";
      case "delivered":
        return "Complete Delivery";
      default:
        return "";
    }
  };

  return (
    <DashboardLayout role="partner" userName="John Delivery">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Delivery Partner Dashboard</h1>
          <div className="flex items-center gap-2">
            <Switch 
              checked={isOnline} 
              onCheckedChange={setIsOnline} 
              id="online-status"
            />
            <label 
              htmlFor="online-status" 
              className={`text-sm font-medium ${isOnline ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'}`}
            >
              {isOnline ? 'Online' : 'Offline'}
            </label>
          </div>
        </div>
        
        {currentOrder ? (
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Current Delivery - Order #{currentOrder.id.slice(-6)}
              </CardTitle>
              <CardDescription>
                {currentOrder.pickupLocation.latitude.toFixed(6)}, {currentOrder.pickupLocation.longitude.toFixed(6)} → 
                {currentOrder.deliveryLocation.latitude.toFixed(6)}, {currentOrder.deliveryLocation.longitude.toFixed(6)}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-8">
                <div className="relative flex items-center justify-between">
                  {statusSteps.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center">
                      <div 
                        className={`
                          z-10 flex h-10 w-10 items-center justify-center rounded-full
                          ${step.status === 'completed' ? 'bg-primary text-primary-foreground' : 
                            step.status === 'current' ? 'bg-primary/20 border-2 border-primary text-primary' : 
                            'bg-muted text-muted-foreground'}
                        `}
                      >
                        {step.icon}
                      </div>
                      <span className="mt-2 text-xs font-medium">{step.label}</span>
                      {index < statusSteps.length - 1 && (
                        <div 
                          className={`
                            absolute top-5 left-0 h-0.5 
                            ${index < statusSteps.findIndex(s => s.status === 'current') ? 'bg-primary' : 'bg-muted'}
                          `}
                          style={{ 
                            left: `${(100 / (statusSteps.length - 1)) * index + (50 / (statusSteps.length - 1))}%`, 
                            width: `${100 / (statusSteps.length - 1) - (100 / (statusSteps.length - 1) / 2)}%` 
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Order Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Customer:</span>
                      <span>James Wilson</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{currentOrder.items.length} items</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total:</span>
                      <span>${currentOrder.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{currentOrder.createdAt.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Est. Delivery:</span>
                      <span>
                        {currentOrder.estimatedDeliveryTime 
                          ? currentOrder.estimatedDeliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Not available'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Actions</h3>
                  <div className="space-y-4">
                    {nextStatus && (
                      <Button 
                        className="w-full" 
                        onClick={() => handleStatusUpdate(nextStatus)}
                      >
                        {formatNextAction()}
                      </Button>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/partner/orders/${currentOrder.id}`}>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/partner/location`}>
                        <Button variant="outline" className="w-full">
                          <MapPin className="mr-2 h-4 w-4" />
                          Update Location
                        </Button>
                      </Link>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Report Issue
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Active Deliveries</CardTitle>
              <CardDescription>
                You don't have any active deliveries at the moment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6">
                <Truck className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center mb-6">
                  Check available orders below or update your availability status.
                </p>
                <Button disabled={!isOnline}>Find Available Orders</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Orders</CardTitle>
              <CardDescription>
                Orders waiting for a delivery partner
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableOrders.length > 0 ? (
                <div className="space-y-4">
                  {availableOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-full p-2 bg-muted">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">Order #{order.id.slice(-6)}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.items.length} items • ${order.totalAmount.toFixed(2)}
                          </div>
                          <div className="text-xs flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" disabled={!isOnline}>Accept</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No available orders at the moment
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
              <CardDescription>
                Your delivery performance today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Deliveries Completed</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Distance</span>
                  <span className="font-medium">18.5 km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Online Time</span>
                  <span className="font-medium">3h 45m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Earnings</span>
                  <span className="font-medium">$42.75</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}