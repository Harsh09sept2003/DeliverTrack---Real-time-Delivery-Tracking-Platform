"use client";

import { useEffect, useRef } from "react";
import { Location } from "@/lib/types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issues
const fixLeafletIcon = () => {
  // Only run this once
  if (typeof window !== "undefined") {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }
};

interface LocationUpdaterMapProps {
  currentLocation: Location | null;
  isLoading: boolean;
  currentOrder: any | null;
}

export default function LocationUpdaterMap({
  currentLocation,
  isLoading,
  currentOrder,
}: LocationUpdaterMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const orderMarkerRefs = useRef<{
    pickup?: L.Marker;
    delivery?: L.Marker;
    route?: L.Polyline;
  }>({});
  
  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    fixLeafletIcon();
    
    // Default center if no location yet
    const defaultCenter: [number, number] = [40.7128, -74.0060]; // NYC
    
    // Create map
    const map = L.map(mapContainerRef.current).setView(
      currentLocation 
        ? [currentLocation.latitude, currentLocation.longitude] 
        : defaultCenter,
      13
    );
    
    // Add tile layer (map imagery)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    
    // Add position marker if we have a location
    if (currentLocation) {
      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: #3B82F6; width: 25px; height: 25px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;">🚚</div>`,
        iconSize: [25, 25],
      });
      
      markerRef.current = L.marker(
        [currentLocation.latitude, currentLocation.longitude],
        { icon: customIcon }
      )
        .addTo(map)
        .bindPopup("Your current location");
        
      // Add accuracy circle
      if (currentLocation.accuracy) {
        L.circle(
          [currentLocation.latitude, currentLocation.longitude],
          {
            radius: currentLocation.accuracy,
            color: "#3B82F6",
            fillColor: "#3B82F6",
            fillOpacity: 0.1,
          }
        ).addTo(map);
      }
    }
    
    // Add order markers if there's an active order
    if (currentOrder) {
      const pickupIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: #14B8A6; width: 25px; height: 25px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;">🏪</div>`,
        iconSize: [25, 25],
      });
      
      const deliveryIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: #F97316; width: 25px; height: 25px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;">🏠</div>`,
        iconSize: [25, 25],
      });
      
      orderMarkerRefs.current.pickup = L.marker(
        [currentOrder.pickupLocation.latitude, currentOrder.pickupLocation.longitude],
        { icon: pickupIcon }
      )
        .addTo(map)
        .bindPopup("Pickup Location");
      
      orderMarkerRefs.current.delivery = L.marker(
        [currentOrder.deliveryLocation.latitude, currentOrder.deliveryLocation.longitude],
        { icon: deliveryIcon }
      )
        .addTo(map)
        .bindPopup("Delivery Location");
      
      // Draw route if we have current location
      if (currentLocation) {
        const routePoints = [
          [currentLocation.latitude, currentLocation.longitude],
          [
            currentOrder.status === "pickup" || currentOrder.status === "assigned"
              ? currentOrder.pickupLocation.latitude 
              : currentOrder.deliveryLocation.latitude,
            currentOrder.status === "pickup" || currentOrder.status === "assigned"
              ? currentOrder.pickupLocation.longitude 
              : currentOrder.deliveryLocation.longitude,
          ],
        ];
        
        orderMarkerRefs.current.route = L.polyline(routePoints as L.LatLngExpression[], {
          color: "#3B82F6",
          weight: 4,
          opacity: 0.7,
          dashArray: "10, 10",
          lineJoin: "round",
        }).addTo(map);
      }
      
      // Fit bounds to include all markers
      const bounds = L.latLngBounds([
        [currentOrder.pickupLocation.latitude, currentOrder.pickupLocation.longitude],
        [currentOrder.deliveryLocation.latitude, currentOrder.deliveryLocation.longitude],
      ]);
      
      if (currentLocation) {
        bounds.extend([currentLocation.latitude, currentLocation.longitude]);
      }
      
      map.fitBounds(bounds, { padding: [50, 50] });
    }
    
    mapRef.current = map;
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  
  // Update position marker when location changes
  useEffect(() => {
    if (!mapRef.current || !currentLocation) return;
    
    const { latitude, longitude } = currentLocation;
    
    // Update existing marker position
    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    } else {
      // Create new marker if it doesn't exist
      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: #3B82F6; width: 25px; height: 25px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;">🚚</div>`,
        iconSize: [25, 25],
      });
      
      markerRef.current = L.marker([latitude, longitude], { icon: customIcon })
        .addTo(mapRef.current)
        .bindPopup("Your current location");
    }
    
    // Update route if there's an active order
    if (currentOrder && orderMarkerRefs.current) {
      // Remove old route
      if (orderMarkerRefs.current.route) {
        mapRef.current.removeLayer(orderMarkerRefs.current.route);
      }
      
      // Draw new route
      const routePoints = [
        [latitude, longitude],
        [
          currentOrder.status === "pickup" || currentOrder.status === "assigned"
            ? currentOrder.pickupLocation.latitude 
            : currentOrder.deliveryLocation.latitude,
          currentOrder.status === "pickup" || currentOrder.status === "assigned"
            ? currentOrder.pickupLocation.longitude 
            : currentOrder.deliveryLocation.longitude,
        ],
      ];
      
      orderMarkerRefs.current.route = L.polyline(routePoints as L.LatLngExpression[], {
        color: "#3B82F6",
        weight: 4,
        opacity: 0.7,
        dashArray: "10, 10",
        lineJoin: "round",
      }).addTo(mapRef.current);
    }
    
    // Center map on current position
    mapRef.current.setView([latitude, longitude], mapRef.current.getZoom());
  }, [currentLocation, currentOrder]);
  
  if (isLoading && !currentLocation) {
    return (
      <div className="w-full h-[400px] bg-muted flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
          <p>Getting your location...</p>
        </div>
      </div>
    );
  }
  
  return <div ref={mapContainerRef} className="w-full h-[400px]" />;
}