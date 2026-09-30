export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Monitor {
  _id: string;
  user: string;
  name: string;
  url: string;
  interval: number;
  isActive: boolean;
  status: "up" | "down" | "unknown";
  responseTime: number;
  uptime: number;
  lastChecked: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardOverview {
  totalMonitors: number;
  onlineMonitors: number;
  averageUptime: number;
  averageResponseTime: number;
}

export interface Check {
  _id: string;
  monitor: string;
  status: "up" | "down";
  statusCode: number | null;
  responseTime: number;
  errorMessage: string | null;
  checkedAt: string;
}