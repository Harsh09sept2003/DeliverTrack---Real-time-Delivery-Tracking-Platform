import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Truck, Store, User, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">DeliverTrack</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Real-time Delivery Tracking
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect vendors, delivery partners, and customers in one seamless platform
            with real-time location tracking and updates.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
              <Store className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">For Vendors</h3>
            <p className="text-muted-foreground mb-4">
              Assign delivery partners to orders, track deliveries, and manage your business.
            </p>
            <Link href="/login?role=vendor">
              <Button className="w-full" variant="outline">Vendor Dashboard</Button>
            </Link>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">For Delivery Partners</h3>
            <p className="text-muted-foreground mb-4">
              Receive orders, share your location, and optimize your delivery routes.
            </p>
            <Link href="/login?role=partner">
              <Button className="w-full" variant="outline">Partner Dashboard</Button>
            </Link>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">For Customers</h3>
            <p className="text-muted-foreground mb-4">
              Track your orders in real-time and get accurate delivery estimates.
            </p>
            <Link href="/login?role=customer">
              <Button className="w-full" variant="outline">Customer Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto p-6 border-t border-border mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-semibold">DeliverTrack</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2025 DeliverTrack. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}