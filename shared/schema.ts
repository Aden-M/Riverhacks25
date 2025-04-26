import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema remains unchanged
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Service categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true,
  color: true,
});

// Service locations
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  hours: text("hours"),
  status: text("status").notNull().default("open"),
  description: text("description"),
  imageUrl: text("image_url"),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  categoryId: integer("category_id").notNull(),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

// Service offerings - what specific services are available at each location
export const offerings = pgTable("offerings", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull(),
  name: text("name").notNull(),
});

export const insertOfferingSchema = createInsertSchema(offerings).omit({
  id: true,
});

// Events at service locations
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  serviceId: integer("service_id").notNull(),
  categoryId: integer("category_id"),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

// Parking locations near services
export const parking = pgTable("parking", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  type: text("type").notNull(),
  hours: text("hours"),
  rate: text("rate"),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  serviceId: integer("service_id").notNull(),
});

export const insertParkingSchema = createInsertSchema(parking).omit({
  id: true,
});

// Emergency alerts
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  active: boolean("active").notNull().default(true),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertOffering = z.infer<typeof insertOfferingSchema>;
export type Offering = typeof offerings.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertParking = z.infer<typeof insertParkingSchema>;
export type Parking = typeof parking.$inferSelect;

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

// Create a service with details type
export type ServiceWithDetails = Service & {
  offerings: Offering[];
  category: Category;
  parking?: Parking[];
};

// Create an event with service type
export type EventWithService = Event & {
  service: Service;
  category?: Category;
};
