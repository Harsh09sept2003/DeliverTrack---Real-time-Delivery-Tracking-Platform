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

interface OrderTrackingMapProps {
  deliveryPartnerLocation: Location | null;
  pickupLocation: Location;
  deliveryLocation: Location;
}

export default function OrderTrackingMap({
  deliveryPartnerLocation,
  pickupLocation,
  deliveryLocation,
}: OrderTrackingMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Markers refs
  const deliveryMarkerRef = useRef<L.Marker | null>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const routeRef = useRef<L.Polyline | null>(null);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    fixLeafletIcon();
    
    // Create a map centered on the pickup location initially
    const map = L.map(mapContainerRef.current).setView(
      [pickupLocation.latitude, pickupLocation.longitude],
      13
    );
    
    // Add tile layer (map imagery)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    
    // Custom icons
    const deliveryIcon = L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color: #3B82F6; width: 25px; height: 25px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;">🚚</div>`,
      iconSize: [25, 25],
    });
    
    const pickupIcon = L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color: #14B8A6; width: 25px; height: 25px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;">🏪</div>`,
      iconSize: [25, 25],
    });
    
    const destinationIcon = L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color: #F97316; width: 25px; height: 25px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;">🏠</div>`,
      iconSize: [25, 25],
    });
    
    // Add markers
    pickupMarkerRef.current = L.marker(
      [pickupLocation.latitude, pickupLocation.longitude],
      { icon: pickupIcon }
    )
      .addTo(map)
      .bindPopup("Pickup Location");
    
    destinationMarkerRef.current = L.marker(
      [deliveryLocation.latitude, deliveryLocation.longitude],
      { icon: destinationIcon }
    )
      .addTo(map)
      .bindPopup("Delivery Location");
    
    if (deliveryPartnerLocation) {
      deliveryMarkerRef.current = L.marker(
        [deliveryPartnerLocation.latitude, deliveryPartnerLocation.longitude],
        { icon: deliveryIcon }
      )
        .addTo(map)
        .bindPopup("Delivery Partner");
      
      // Draw route from current position to destination
      const routePoints = [
        [deliveryPartnerLocation.latitude, deliveryPartnerLocation.longitude],
        [deliveryLocation.latitude, deliveryLocation.longitude],
      ];
      
      routeRef.current = L.polyline(routePoints as L.LatLngExpression[], {
        color: "#3B82F6",
        weight: 4,
        opacity: 0.7,
        dashArray: "10, 10",
        lineJoin: "round",
      }).addTo(map);
    }
    
    // Fit bounds to include all markers
    const bounds = L.latLngBounds([
      [pickupLocation.latitude, pickupLocation.longitude],
      [deliveryLocation.latitude, deliveryLocation.longitude],
    ]);
    
    if (deliveryPartnerLocation) {
      bounds.extend([
        deliveryPartnerLocation.latitude,
        deliveryPartnerLocation.longitude,
      ]);
    }
    
    map.fitBounds(bounds, { padding: [50, 50] });
    
    mapRef.current = map;
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  
  // Update delivery partner location
  useEffect(() => {
    if (!mapRef.current || !deliveryPartnerLocation) return;
    
    const { latitude, longitude } = deliveryPartnerLocation;
    
    // Create or update delivery marker
    if (deliveryMarkerRef.current) {
      deliveryMarkerRef.current.setLatLng([latitude, longitude]);
    } else {
      const deliveryIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: #3B82F6; width: 25px; height: 25px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;">🚚</div>`,
        iconSize: [25, 25],
      });
      
      deliveryMarkerRef.current = L.marker([latitude, longitude], { icon: deliveryIcon })
        .addTo(mapRef.current)
        .bindPopup("Delivery Partner");
    }
    
    // Update route
    if (routeRef.current) {
      mapRef.current.removeLayer(routeRef.current);
    }
    
    const routePoints = [
      [latitude, longitude],
      [deliveryLocation.latitude, deliveryLocation.longitude],
    ];
    
    routeRef.current = L.polyline(routePoints as L.LatLngExpression[], {
      color: "#3B82F6",
      weight: 4,
      opacity: 0.7,
      dashArray: "10, 10",
      lineJoin: "round",
    }).addTo(mapRef.current);
    
    // Center map on delivery partner with animation
    mapRef.current.panTo([latitude, longitude], { animate: true, duration: 1 });
  }, [deliveryPartnerLocation, deliveryLocation]);
  
  return <div ref={mapContainerRef} className="w-full h-[400px]" />;
}