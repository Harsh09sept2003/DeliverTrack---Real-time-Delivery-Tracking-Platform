# DeliverTrack - Real-time Delivery Tracking Platform

A modern, real-time delivery tracking platform built with Next.js 13, TypeScript, and Leaflet.js, enabling seamless coordination between vendors, delivery partners, and customers.

## Objective

DeliverTrack aims to provide a comprehensive solution for real-time delivery tracking in a multivendor environment. The platform facilitates efficient communication and coordination between vendors, delivery partners, and customers through live location tracking, status updates, and interactive maps.

## Architecture Overview

### Frontend Architecture
- **Next.js 13**: App Router for server-side rendering and routing
- **TypeScript**: Type-safe development environment
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable UI components
- **Leaflet.js**: Interactive maps for real-time tracking
- **Socket.IO Client**: Real-time bidirectional communication

### State Management
- React's built-in Context API for global state
- React Query for server state management
- Local state with useState for component-level state

### Real-time Communication
- Socket.IO for bidirectional, event-based communication
- Custom WebSocket events for location updates and order status changes
- Optimized connection handling with reconnection strategies

## Features by Role

### Customer Dashboard
- Real-time order tracking with live map updates
- Order history and status monitoring
- Estimated delivery time calculations
- Saved delivery locations management
- Direct communication with delivery partners

### Vendor Dashboard
- Order management system
- Delivery partner assignment
- Real-time order status updates
- Performance analytics and insights
- Multi-location support

### Delivery Partner Dashboard
- Live location sharing
- Order pickup and delivery management
- Route optimization
- Earnings tracking
- Status updates and availability toggle

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/delivertrack.git
cd delivertrack
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Access the application:
- Open http://localhost:3000
- Use the following demo credentials:
  - Customer: customer@demo.com / demo123
  - Vendor: vendor@demo.com / demo123
  - Partner: partner@demo.com / demo123

## Real-Time Tracking Explanation

DeliverTrack implements real-time tracking using the following components:

1. **Location Updates**
   - HTML5 Geolocation API for accurate position tracking
   - Socket.IO events for real-time location broadcasting
   - Optimized update frequency (every 10 seconds)

2. **Map Integration**
   - Leaflet.js for interactive maps
   - Custom markers for different entities
   - Polyline routing for delivery paths
   - Automatic map centering and zoom

3. **Status Synchronization**
   - Event-based architecture for status updates
   - Automatic reconnection handling
   - Fallback mechanisms for offline scenarios

## Simulating Location

For development and testing, DeliverTrack includes a location simulation system:

1. **Mock Data Generation**
   - Randomized order creation
   - Simulated delivery routes
   - Realistic timing calculations

2. **Testing Scenarios**
   - Various delivery states
   - Edge cases handling
   - Network condition simulation

## Project Structure

```
delivertrack/
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   ├── customer/          # Customer dashboard
│   ├── partner/           # Delivery partner dashboard
│   └── vendor/            # Vendor dashboard
├── components/            # Reusable React components
├── lib/                   # Utility functions and types
├── hooks/                 # Custom React hooks
└── public/               # Static assets
```

## TypeScript & Code Quality

- Strict TypeScript configuration
- ESLint and Prettier integration
- Comprehensive type definitions
- Component prop validation
- Error boundary implementation

## Evaluation Criteria Checklist

- [x] Real-time location tracking
- [x] Role-based access control
- [x] Responsive design
- [x] Interactive maps
- [x] Order management
- [x] Status updates
- [x] Error handling
- [x] Performance optimization
- [x] Code documentation
- [x] Type safety

## Author

Created by [Harsh Kumar]
- GitHub: [@Harsh09sept2003](https://github.com/Harsh09sept2003)
- LinkedIn: [harsh-kumar-30243b264](https://www.linkedin.com/in/harsh-kumar-30243b264/)

## Acknowledgments

- Leaflet.js for mapping functionality
- shadcn/ui for UI components
- Next.js team for the amazing framework
