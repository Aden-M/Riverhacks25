import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  services, type Service, type InsertService, type ServiceWithDetails,
  offerings, type Offering, type InsertOffering,
  events, type Event, type InsertEvent, type EventWithService,
  parking, type Parking, type InsertParking,
  alerts, type Alert, type InsertAlert
} from "@shared/schema";

// Storage interface with all required CRUD methods
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categories
  getCategory(id: number): Promise<Category | undefined>;
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Services
  getService(id: number): Promise<Service | undefined>;
  getServiceWithDetails(id: number): Promise<ServiceWithDetails | undefined>;
  getAllServices(): Promise<Service[]>;
  getServicesByCategory(categoryId: number): Promise<ServiceWithDetails[]>;
  getServicesNearLocation(latitude: number, longitude: number, radius?: number): Promise<ServiceWithDetails[]>;
  searchServices(query: string): Promise<ServiceWithDetails[]>;
  createService(service: InsertService): Promise<Service>;
  
  // Offerings
  getOfferingsByService(serviceId: number): Promise<Offering[]>;
  createOffering(offering: InsertOffering): Promise<Offering>;
  
  // Events
  getEvent(id: number): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  getEventsByService(serviceId: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Parking
  getParkingByService(serviceId: number): Promise<Parking[]>;
  createParking(parking: InsertParking): Promise<Parking>;
  
  // Alerts
  getAllAlerts(): Promise<Alert[]>;
  getActiveAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private services: Map<number, Service>;
  private offerings: Map<number, Offering>;
  private events: Map<number, Event>;
  private parking: Map<number, Parking>;
  private alerts: Map<number, Alert>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private serviceIdCounter: number;
  private offeringIdCounter: number;
  private eventIdCounter: number;
  private parkingIdCounter: number;
  private alertIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.services = new Map();
    this.offerings = new Map();
    this.events = new Map();
    this.parking = new Map();
    this.alerts = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.serviceIdCounter = 1;
    this.offeringIdCounter = 1;
    this.eventIdCounter = 1;
    this.parkingIdCounter = 1;
    this.alertIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category methods
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Service methods
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async getServiceWithDetails(id: number): Promise<ServiceWithDetails | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    
    const category = this.categories.get(service.categoryId);
    const offerings = await this.getOfferingsByService(id);
    const parkingSpots = await this.getParkingByService(id);
    
    return {
      ...service,
      category: category!,
      offerings,
      parking: parkingSpots
    };
  }
  
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getServicesByCategory(categoryId: number): Promise<ServiceWithDetails[]> {
    const allServices = Array.from(this.services.values())
      .filter(service => service.categoryId === categoryId);
    
    return Promise.all(
      allServices.map(async (service) => {
        const category = this.categories.get(service.categoryId);
        const offerings = await this.getOfferingsByService(service.id);
        
        return {
          ...service,
          category: category!,
          offerings
        };
      })
    );
  }
  
  async getServicesNearLocation(latitude: number, longitude: number, radius: number = 10): Promise<ServiceWithDetails[]> {
    // In a real app, this would filter services by distance
    // For this demo, return all services with category and offerings
    const allServices = Array.from(this.services.values());
    
    return Promise.all(
      allServices.map(async (service) => {
        const category = this.categories.get(service.categoryId);
        const offerings = await this.getOfferingsByService(service.id);
        
        return {
          ...service,
          category: category!,
          offerings
        };
      })
    );
  }
  
  async searchServices(query: string): Promise<ServiceWithDetails[]> {
    // Search services by name, description, or address
    const lowercaseQuery = query.toLowerCase();
    const allServices = Array.from(this.services.values())
      .filter(service => 
        service.name.toLowerCase().includes(lowercaseQuery) ||
        (service.description && service.description.toLowerCase().includes(lowercaseQuery)) ||
        service.address.toLowerCase().includes(lowercaseQuery)
      );
    
    return Promise.all(
      allServices.map(async (service) => {
        const category = this.categories.get(service.categoryId);
        const offerings = await this.getOfferingsByService(service.id);
        
        return {
          ...service,
          category: category!,
          offerings
        };
      })
    );
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceIdCounter++;
    const service: Service = { 
      ...insertService, 
      id,
      status: insertService.status || 'open',
      phone: insertService.phone || null,
      hours: insertService.hours || null,
      description: insertService.description || null,
      imageUrl: insertService.imageUrl || null
    };
    this.services.set(id, service);
    return service;
  }
  
  // Offering methods
  async getOfferingsByService(serviceId: number): Promise<Offering[]> {
    return Array.from(this.offerings.values())
      .filter(offering => offering.serviceId === serviceId);
  }
  
  async createOffering(insertOffering: InsertOffering): Promise<Offering> {
    const id = this.offeringIdCounter++;
    const offering: Offering = { ...insertOffering, id };
    this.offerings.set(id, offering);
    return offering;
  }
  
  // Event methods
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }
  
  async getEventsByService(serviceId: number): Promise<Event[]> {
    return Array.from(this.events.values())
      .filter(event => event.serviceId === serviceId);
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const event: Event = { 
      ...insertEvent, 
      id,
      description: insertEvent.description || null,
      categoryId: insertEvent.categoryId || null,
      startTime: insertEvent.startTime || null,
      endTime: insertEvent.endTime || null
    };
    this.events.set(id, event);
    return event;
  }
  
  // Parking methods
  async getParkingByService(serviceId: number): Promise<Parking[]> {
    return Array.from(this.parking.values())
      .filter(parking => parking.serviceId === serviceId);
  }
  
  async createParking(insertParking: InsertParking): Promise<Parking> {
    const id = this.parkingIdCounter++;
    const parkingSpot: Parking = { 
      ...insertParking, 
      id,
      hours: insertParking.hours || null,
      rate: insertParking.rate || null
    };
    this.parking.set(id, parkingSpot);
    return parkingSpot;
  }
  
  // Alert methods
  async getAllAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values());
  }
  
  async getActiveAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.active === true);
  }
  
  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.alertIdCounter++;
    const alert: Alert = { 
      ...insertAlert, 
      id,
      active: insertAlert.active !== undefined ? insertAlert.active : true,
      endTime: insertAlert.endTime || null
    };
    this.alerts.set(id, alert);
    return alert;
  }
}

export const storage = new MemStorage();
