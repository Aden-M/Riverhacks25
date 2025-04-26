import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to one decimal place
}

// Convert degrees to radians
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Format address for display
export function formatAddress(address: string): string {
  return address.replace(/, Austin, TX \d+$/, "");
}

// Format time to 12-hour format
export function formatTime(time: string): string {
  if (!time) return "";
  
  // If time is already in 12-hour format, return it
  if (time.includes("AM") || time.includes("PM")) {
    return time;
  }
  
  // Parse the time string (assuming format like "14:30")
  const [hours, minutes] = time.split(":").map(Number);
  
  // Convert to 12-hour format
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert 0 to 12
  
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

// Format date string
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Get categories icon class from name
export function getCategoryIconClass(categoryName: string): string {
  const iconMap: Record<string, string> = {
    "Food Assistance": "utensils",
    "Housing": "home",
    "Health": "heartbeat",
    "Childcare": "child",
    "Employment": "briefcase",
    "Transportation": "bus",
  };
  
  return iconMap[categoryName] || "circle";
}

// Get category color from name
export function getCategoryColor(categoryName: string): string {
  const colorMap: Record<string, string> = {
    "Food Assistance": "#F2C94C", // Primary (yellow gold)
    "Housing": "#BF9D37", // Secondary (darker gold)
    "Health": "#B3A369", // Tertiary (tan/olive gold)
    "Childcare": "#F2C94C", // Primary (yellow gold)
    "Employment": "#BF9D37", // Secondary (darker gold)
    "Transportation": "#B3A369", // Tertiary (tan/olive gold)
  };
  
  return colorMap[categoryName] || "#A0A0A0"; // Default to neutral
}

// Get status color
export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    "open": "#B3A369", // Tertiary (olive gold)
    "closed": "#F05454", // Error (coral red)
    "closing_soon": "#BF9D37", // Secondary (darker gold)
  };
  
  return statusMap[status.toLowerCase()] || "#8A8A8A"; // Default to neutral variant
}

// Get current status based on hours
export function getCurrentStatus(hours: string): {
  status: "open" | "closing_soon" | "closed";
  closingTime: string | null;
} {
  // This is a simplified implementation
  // A real implementation would parse the hours string and compare with current time
  
  // For demo purposes, randomly return one of the statuses
  const statuses = ["open", "closing_soon", "closed"] as const;
  const randomStatus = statuses[Math.floor(Math.random() * 3)];
  
  // Extract closing time from hours string if possible
  let closingTime: string | null = null;
  
  if (hours) {
    const match = hours.match(/(\d+:\d+ [AP]M)/g);
    if (match && match.length > 0) {
      closingTime = match[match.length - 1];
    }
  }
  
  return {
    status: randomStatus,
    closingTime,
  };
}

// Create a function to get status text based on status
export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    "open": "Open Now",
    "closed": "Closed",
    "closing_soon": "Closing Soon",
  };
  
  return statusMap[status.toLowerCase()] || status;
}
