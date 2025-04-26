import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize with sample data if needed
  await initializeData();

  // API routes
  
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get all services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get services by category
  app.get("/api/services/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const services = await storage.getServicesByCategory(categoryId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services by category" });
    }
  });

  // Get services near location
  app.get("/api/services/nearby", async (req, res) => {
    try {
      const latitudeString = req.query.latitude as string;
      const longitudeString = req.query.longitude as string;
      const radiusString = req.query.radius as string;
      
      const latitude = parseFloat(latitudeString);
      const longitude = parseFloat(longitudeString);
      const radius = radiusString ? parseFloat(radiusString) : 10; // Default 10 miles
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Invalid location coordinates" });
      }
      
      const services = await storage.getServicesNearLocation(latitude, longitude, radius);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nearby services" });
    }
  });

  // Get service by ID with details
  app.get("/api/services/:serviceId", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.serviceId);
      if (isNaN(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID" });
      }
      
      const service = await storage.getServiceWithDetails(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service details" });
    }
  });

  // Search services
  app.get("/api/services/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length === 0) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const services = await storage.searchServices(query);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to search services" });
    }
  });

  // Get all events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Get events by service ID
  app.get("/api/events/service/:serviceId", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.serviceId);
      if (isNaN(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID" });
      }
      
      const events = await storage.getEventsByService(serviceId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events for service" });
    }
  });

  // Get parking by service ID
  app.get("/api/parking/service/:serviceId", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.serviceId);
      if (isNaN(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID" });
      }
      
      const parking = await storage.getParkingByService(serviceId);
      res.json(parking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parking for service" });
    }
  });

  // Get active emergency alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  // Get weather data (in a real app, would fetch from external API)
  app.get("/api/weather", async (req, res) => {
    try {
      // This is a placeholder - in a real app, you would fetch from a weather API
      const weatherData = {
        location: "Austin, TX",
        temperature: 84,
        unit: "F",
        condition: "sunny",
        icon: "sun"
      };
      
      res.json(weatherData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Initialize demo data for the app
async function initializeData() {
  // Check if categories already exist
  const existingCategories = await storage.getAllCategories();
  if (existingCategories.length > 0) {
    return; // Data already initialized
  }

  // Add categories
  const foodCategory = await storage.createCategory({
    name: "Food Assistance",
    icon: "utensils",
    color: "#E57200" // Austin orange
  });

  const housingCategory = await storage.createCategory({
    name: "Housing",
    icon: "home",
    color: "#3399CC" // Austin blue
  });

  const healthCategory = await storage.createCategory({
    name: "Health",
    icon: "heartbeat",
    color: "#F44336" // Error red
  });

  const childcareCategory = await storage.createCategory({
    name: "Childcare",
    icon: "child",
    color: "#4CAF50" // Success green
  });

  const employmentCategory = await storage.createCategory({
    name: "Employment",
    icon: "briefcase",
    color: "#E57200" // Austin orange
  });

  const transportationCategory = await storage.createCategory({
    name: "Transportation",
    icon: "bus",
    color: "#2196F3" // Info blue
  });

  // Add services
  const rosewood = await storage.createService({
    name: "Rosewood-Zaragosa Neighborhood Center",
    address: "2800 Webberville Rd, Austin, TX 78702",
    phone: "(512) 972-6740",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    status: "open",
    description: "Provides social services and recreational activities to East Austin residents.",
    imageUrl: "https://images.unsplash.com/photo-1572297350242-e9d940f8ca2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    latitude: 30.2782,
    longitude: -97.7140,
    categoryId: foodCategory.id
  });

  const eastAustin = await storage.createService({
    name: "East Austin Neighborhood Center",
    address: "211 Comal St, Austin, TX 78702",
    phone: "(512) 972-6650",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM",
    status: "open",
    description: "Provides housing assistance and community resources.",
    imageUrl: "https://images.unsplash.com/photo-1541976344724-c086710bf4fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    latitude: 30.2634,
    longitude: -97.7243,
    categoryId: housingCategory.id
  });

  const southAustin = await storage.createService({
    name: "South Austin Neighborhood Center",
    address: "2508 Durwood St, Austin, TX 78704",
    phone: "(512) 972-6840",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    status: "open",
    description: "Provides health services and community support.",
    imageUrl: "https://images.unsplash.com/photo-1631902112544-245e818f34c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    latitude: 30.2425,
    longitude: -97.7597,
    categoryId: healthCategory.id
  });

  const montopolis = await storage.createService({
    name: "Montopolis Community Center",
    address: "1200 Montopolis Dr, Austin, TX 78741",
    phone: "(512) 972-6650",
    hours: "Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM",
    status: "open",
    description: "Offers childcare services and family support programs.",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    latitude: 30.2320,
    longitude: -97.7081,
    categoryId: childcareCategory.id
  });

  const stjohn = await storage.createService({
    name: "St. John Community Center",
    address: "7500 Blessing Ave, Austin, TX 78752",
    phone: "(512) 972-5139",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    status: "open",
    description: "Offers employment resources and job training programs.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    latitude: 30.3222,
    longitude: -97.7045,
    categoryId: employmentCategory.id
  });

  // Add offerings for services
  await storage.createOffering({
    serviceId: rosewood.id,
    name: "Food Pantry"
  });
  
  await storage.createOffering({
    serviceId: rosewood.id,
    name: "SNAP Assistance"
  });
  
  await storage.createOffering({
    serviceId: rosewood.id,
    name: "WIC Program"
  });

  await storage.createOffering({
    serviceId: eastAustin.id,
    name: "Rental Assistance"
  });
  
  await storage.createOffering({
    serviceId: eastAustin.id,
    name: "Utility Assistance"
  });
  
  await storage.createOffering({
    serviceId: eastAustin.id,
    name: "Housing Counseling"
  });

  await storage.createOffering({
    serviceId: southAustin.id,
    name: "Health Screenings"
  });
  
  await storage.createOffering({
    serviceId: southAustin.id,
    name: "Immunizations"
  });
  
  await storage.createOffering({
    serviceId: southAustin.id,
    name: "MAP Enrollment"
  });

  // Add events
  const today = new Date();
  
  await storage.createEvent({
    title: "Food Drive",
    description: "Community food drive. Bring non-perishable items to donate.",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    startTime: "10:00 AM",
    endTime: "2:00 PM",
    serviceId: rosewood.id,
    categoryId: foodCategory.id
  });

  await storage.createEvent({
    title: "Job Fair",
    description: "Local businesses will be hiring on the spot.",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
    startTime: "9:00 AM",
    endTime: "12:00 PM",
    serviceId: stjohn.id,
    categoryId: employmentCategory.id
  });

  await storage.createEvent({
    title: "ESL Class",
    description: "Free English as a Second Language class.",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
    startTime: "6:00 PM",
    endTime: "8:00 PM",
    serviceId: eastAustin.id,
    categoryId: null
  });

  await storage.createEvent({
    title: "Health Screenings",
    description: "Free health screenings including blood pressure, glucose, and cholesterol.",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
    startTime: "9:00 AM",
    endTime: "3:00 PM",
    serviceId: southAustin.id,
    categoryId: healthCategory.id
  });

  await storage.createEvent({
    title: "Community Meeting",
    description: "Monthly community meeting to discuss neighborhood issues.",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
    startTime: "6:30 PM",
    endTime: "8:00 PM",
    serviceId: montopolis.id,
    categoryId: null
  });

  // Add parking
  await storage.createParking({
    name: "Rosewood Center Parking Lot",
    address: "2800 Webberville Rd, Austin, TX 78702",
    type: "Free",
    hours: "24/7",
    rate: "Free",
    latitude: 30.2784,
    longitude: -97.7143,
    serviceId: rosewood.id
  });

  await storage.createParking({
    name: "East Austin Center Parking",
    address: "211 Comal St, Austin, TX 78702",
    type: "Free",
    hours: "7:00 AM - 8:00 PM",
    rate: "Free",
    latitude: 30.2636,
    longitude: -97.7245,
    serviceId: eastAustin.id
  });

  // Add emergency alerts
  await storage.createAlert({
    message: "Flash Flood Warning: Avoid low water crossings near Shoal Creek until 7PM",
    type: "warning",
    active: true,
    startTime: new Date(),
    endTime: new Date(today.setHours(today.getHours() + 12))
  });
}
