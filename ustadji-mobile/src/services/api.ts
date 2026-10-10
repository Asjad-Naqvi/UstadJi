// API client for UstadJi Mobile App connecting to NestJS Backend
import { Platform } from "react-native";

// Automatically uses LAN IP for physical phones on Expo Go and localhost for Web
export const API_HOST_IP = "192.168.1.7";
export const API_BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:4000"
    : `http://${API_HOST_IP}:4000`;

console.log(`🌐 [UstadJi API] Connecting to backend at: ${API_BASE_URL}`);

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Login failed");
    }
    return res.json();
  },

  async signup(data: {
    fullName: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
    sector?: string;
    trade?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Signup failed");
    }
    return res.json();
  },

  // Providers
  async getProviders(trade?: string, sector?: string) {
    let url = `${API_BASE_URL}/providers`;
    const params = new URLSearchParams();
    if (trade) params.append("trade", trade);
    if (sector) params.append("sector", sector);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch providers");
    return res.json();
  },

  async getProvider(id: string) {
    const res = await fetch(`${API_BASE_URL}/providers/${id}`);
    if (!res.ok) throw new Error("Failed to fetch provider details");
    return res.json();
  },

  // Module 5: Booking & Scheduling
  async getAvailability(providerId: string, date: string) {
    const res = await fetch(
      `${API_BASE_URL}/bookings/availability/${providerId}?date=${date}`
    );
    if (!res.ok) throw new Error("Failed to fetch available time slots");
    return res.json();
  },

  async createBooking(data: {
    customerId: string;
    providerId: string;
    serviceCategory: string;
    issueDescription: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    estimatedPrice?: number;
  }) {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to create booking");
    }
    return res.json();
  },

  async getBookings(customerId?: string, providerId?: string, status?: string) {
    let url = `${API_BASE_URL}/bookings`;
    const params = new URLSearchParams();
    if (customerId) params.append("customerId", customerId);
    if (providerId) params.append("providerId", providerId);
    if (status) params.append("status", status);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
  },

  async getBooking(id: string) {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}`);
    if (!res.ok) throw new Error("Failed to fetch booking details");
    return res.json();
  },

  async acceptBooking(bookingId: string, providerId: string) {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/accept`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to accept booking");
    }
    return res.json();
  },

  async rejectBooking(bookingId: string, providerId: string, reason?: string) {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/reject`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId, reason }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to reject booking");
    }
    return res.json();
  },

  async rescheduleBooking(
    bookingId: string,
    data: {
      newDate: string;
      newStartTime: string;
      newEndTime: string;
      reason?: string;
      requestedBy?: "CUSTOMER" | "PROVIDER";
    }
  ) {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/reschedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to reschedule booking");
    }
    return res.json();
  },

  async updateBookingStatus(
    bookingId: string,
    status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DISPUTED",
    reason?: string,
    changedBy?: "CUSTOMER" | "PROVIDER" | "ADMIN"
  ) {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reason, changedBy }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to update booking status");
    }
    return res.json();
  },
};
