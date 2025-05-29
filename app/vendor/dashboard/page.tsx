"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  MapPin,
  BarChart3,
  Truck,
} from "lucide-react";
import { Order, OrderStatus } from "@/lib/types";
import { mockOrders } from "@/lib/mock-data";
import Link from "next/link";

export default function VendorDashboard() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "accepted":
      case "assigned":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "pickup":
      case "in_transit":
        return <MapPin className="h-5 w-5 text-indigo-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "accepted":
      case "assigned":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "pickup":
      case "in_transit":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  // Count orders by status
  const orderCounts = {
    pending: orders.filter(order => order.status === "pending").length,
    inProgress: orders.filter(order => ["accepted", "assigned", "pickup", "in_transit"].includes(order.status)).length,
    completed: orders.filter(order => order.status === "delivered").length,
    cancelled: orders.filter(order => order.status === "cancelled").length,
  };
  
  // Get recent orders (max 5)
  const recentOrders = [...orders]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <DashboardLayout role="vendor" userName="John's Restaurant">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
          <Link href="/vendor/orders/new">
            <Button>
              <Package className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderCounts.pending}</div>
              <p className="text-xs text-muted-foreground">
                Waiting for acceptance
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderCounts.inProgress}</div>
              <p className="text-xs text-muted-foreground">
                Orders being delivered
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderCounts.completed}</div>
              <p className="text-xs text-muted-foreground">
                Successfully delivered
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderCounts.cancelled}</div>
              <p className="text-xs text-muted-foreground">
                Orders cancelled
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                View and manage your most recent orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
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
                          <div className="text-xs text-muted-foreground">
                            {order.createdAt.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.replace("_", " ").toUpperCase()}
                        </span>
                        <Link href={`/vendor/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No orders found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Delivery Partners</CardTitle>
              <CardDescription>
                Partners available for order assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                4 delivery partners online
              </div>
              <div className="flex justify-center">
                <Link href="/vendor/partners">
                  <Button variant="outline">View All Partners</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>
                Delivery statistics and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Delivery Time</span>
                  <span className="font-medium">28 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Orders Today</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Customer Satisfaction</span>
                  <span className="font-medium">4.8/5</span>
                </div>
                <div className="flex justify-center pt-4">
                  <Button variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Full Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}