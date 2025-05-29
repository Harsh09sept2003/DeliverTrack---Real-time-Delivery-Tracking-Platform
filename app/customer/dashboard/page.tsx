"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  ShoppingBag, 
  Clock, 
  Store, 
  ArrowRight,
  Star,
  Plus,
} from "lucide-react";
import { Order, OrderStatus } from "@/lib/types";
import { mockOrders } from "@/lib/mock-data";

export default function CustomerDashboard() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
      case "accepted":
        return <Clock className="h-5 w-5" />;
      case "assigned":
      case "pickup":
      case "in_transit":
        return <Package className="h-5 w-5" />;
      case "delivered":
        return <Star className="h-5 w-5" />;
      case "cancelled":
        return <Package className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };
  
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "Waiting for vendor";
      case "accepted":
        return "Preparing your order";
      case "assigned":
        return "Delivery partner assigned";
      case "pickup":
        return "Order picked up";
      case "in_transit":
        return "On the way to you";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status.replace("_", " ");
    }
  };
  
  // Get active orders (non-delivered, non-cancelled)
  const activeOrders = orders.filter(
    (order) => !["delivered", "cancelled"].includes(order.status)
  );
  
  // Get past orders (delivered or cancelled)
  const pastOrders = orders
    .filter((order) => ["delivered", "cancelled"].includes(order.status))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);
  
  return (
    <DashboardLayout role="customer" userName="James Wilson">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Customer Dashboard</h1>
          <Link href="/customer/orders/new">
            <Button>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Place New Order
            </Button>
          </Link>
        </div>
        
        {activeOrders.length > 0 ? (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Active Order
              </CardTitle>
              <CardDescription>
                Track your current delivery in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activeOrders.slice(0, 1).map((order) => (
                  <div key={order.id} className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Order #{order.id.slice(-6)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} items • ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          {getStatusIcon(order.status)}
                          <span>{getStatusText(order.status)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Updated: {order.updatedAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-card p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="rounded-full p-2 bg-muted">
                          <Store className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">John's Restaurant</div>
                          <div className="text-xs text-muted-foreground">Vendor</div>
                        </div>
                      </div>
                      
                      <div className="mb-3 px-4 py-2 bg-muted rounded-md">
                        <div className="text-sm">
                          {order.items.map((item, index) => (
                            <div key={item.id} className="flex justify-between py-1">
                              <span>{item.name} × {item.quantity}</span>
                              <span>${item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Link href={`/customer/track/${order.id}`}>
                          <Button>
                            Track Order
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Active Orders</CardTitle>
              <CardDescription>
                You don't have any active orders at the moment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center mb-6">
                  Ready to place an order? Browse vendors and start shopping.
                </p>
                <Link href="/customer/vendors">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Browse Vendors
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Your order history from the past 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pastOrders.length > 0 ? (
              <div className="space-y-4">
                {pastOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`rounded-full p-2 ${order.status === "delivered" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}>
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <div className="font-medium">Order #{order.id.slice(-6)}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.items.length} items • ${order.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.updatedAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/customer/orders/${order.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm">Reorder</Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-center pt-2">
                  <Link href="/customer/orders">
                    <Button variant="outline">
                      View All Orders
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No past orders found
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Saved Addresses</CardTitle>
              <CardDescription>
                Manage your delivery locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-3">
                  <div className="font-medium">Home</div>
                  <div className="text-sm text-muted-foreground">
                    123 Main Street, Apt 4B, New York, NY 10001
                  </div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="font-medium">Work</div>
                  <div className="text-sm text-muted-foreground">
                    456 Office Tower, 7th Floor, New York, NY 10002
                  </div>
                </div>
                <div className="flex justify-center pt-2">
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Address
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Favorite Vendors</CardTitle>
              <CardDescription>
                Quick access to your preferred vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">John's Restaurant</div>
                    <div className="text-sm text-muted-foreground">
                      Italian • 0.8 miles away
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Order</Button>
                </div>
                <div className="border rounded-md p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">Green Grocery</div>
                    <div className="text-sm text-muted-foreground">
                      Grocery • 1.2 miles away
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Order</Button>
                </div>
                <div className="flex justify-center pt-2">
                  <Link href="/customer/vendors">
                    <Button variant="outline">
                      View All Vendors
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}