"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MapPin, Navigation, AlertTriangle, RefreshCw } from "lucide-react";
import { Location } from "@/lib/types";
import { mockOrders } from "@/lib/mock-data";
import dynamic from "next/dynamic";

// Dynamically import map component to prevent SSR issues
const LocationUpdaterMap = dynamic(() => import("@/components/location-updater-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-muted flex items-center justify-center">
      <div className="animate-pulse">Loading map...</div>
    </div>
  ),
});

export default function DeliveryPartnerLocation() {
  const [isLocationTracking, setIsLocationTracking] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<any | null>(null);
  
  useEffect(() => {
    // In a real app, this would come from an API call
    const assigned = mockOrders.find(
      (order) => order.status === "in_transit" || order.status === "pickup"
    );
    
    if (assigned) {
      setCurrentOrder(assigned);
    }
  }, []);
  
  useEffect(() => {
    if (isLocationTracking) {
      // Attempt to get user's location
      setIsLoading(true);
      setError(null);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date(),
            accuracy: position.coords.accuracy,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined,
          });
          setIsLoading(false);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Unable to access your location. Please check your browser permissions.");
          setIsLoading(false);
        },
        { enableHighAccuracy: true }
      );
      
      // Set up continuous tracking
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date(),
            accuracy: position.coords.accuracy,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined,
          });
          setError(null);
        },
        (err) => {
          console.error("Error watching location:", err);
          setError("Location tracking error. Please try refreshing the page.");
        },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
      
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [isLocationTracking]);
  
  const handleManualLocationUpdate = () => {
    setIsLoading(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date(),
          accuracy: position.coords.accuracy,
          heading: position.coords.heading || undefined,
          speed: position.coords.speed || undefined,
        });
        setIsLoading(false);
        
        // In a real app, you would send this to your backend or Socket.IO
        console.log("Location updated:", {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date(),
        });
      },
      (err) => {
        console.error("Error getting location:", err);
        setError("Unable to access your location. Please check your browser permissions.");
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };
  
  return (
    <DashboardLayout role="partner" userName="John Delivery">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Location Tracking</h1>
          <div className="flex items-center gap-2">
            <Switch 
              checked={isLocationTracking} 
              onCheckedChange={setIsLocationTracking} 
              id="location-tracking"
            />
            <label 
              htmlFor="location-tracking" 
              className={`text-sm font-medium ${isLocationTracking ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'}`}
            >
              {isLocationTracking ? 'Tracking Enabled' : 'Tracking Disabled'}
            </label>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/10">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Your Location
            </CardTitle>
            <CardDescription>
              Your real-time location is shared with customers during active deliveries
            </CardDescription>
          </CardHeader>
          
          {error ? (
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-destructive font-medium mb-2">{error}</p>
                <p className="text-muted-foreground text-sm mb-4">
                  Location tracking requires permission to access your device's GPS.
                </p>
                <Button onClick={handleManualLocationUpdate}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          ) : (
            <LocationUpdaterMap 
              currentLocation={currentLocation}
              isLoading={isLoading}
              currentOrder={currentOrder}
            />
          )}
        </Card>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Location Settings</CardTitle>
              <CardDescription>
                Configure your location tracking preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">High Accuracy Mode</h3>
                    <p className="text-xs text-muted-foreground">
                      Uses GPS, WiFi, and mobile networks for precise location
                    </p>
                  </div>
                  <Switch checked={true} id="high-accuracy" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Background Tracking</h3>
                    <p className="text-xs text-muted-foreground">
                      Continue tracking when app is in the background
                    </p>
                  </div>
                  <Switch checked={true} id="background-tracking" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Battery Optimization</h3>
                    <p className="text-xs text-muted-foreground">
                      Reduce location update frequency to save battery
                    </p>
                  </div>
                  <Switch checked={false} id="battery-optimization" />
                </div>
                
                <div className="flex justify-center pt-4">
                  <Button onClick={handleManualLocationUpdate} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Navigation className="mr-2 h-4 w-4" />
                        Update Location Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>
                Current tracking information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentLocation ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Latitude</span>
                    <span className="font-medium">{currentLocation.latitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Longitude</span>
                    <span className="font-medium">{currentLocation.longitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Accuracy</span>
                    <span className="font-medium">
                      {currentLocation.accuracy ? `${currentLocation.accuracy.toFixed(1)} meters` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Speed</span>
                    <span className="font-medium">
                      {currentLocation.speed ? `${(currentLocation.speed * 3.6).toFixed(1)} km/h` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Heading</span>
                    <span className="font-medium">
                      {currentLocation.heading ? `${currentLocation.heading.toFixed(0)}°` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Updated</span>
                    <span className="font-medium">
                      {currentLocation.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {isLoading ? "Getting your location..." : "No location data available"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}