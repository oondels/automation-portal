import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "../lib/utils";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  delay: number;
  timestamp: number;
}

interface NotificationProps {
  notification: NotificationItem;
  onRemove: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: {
    container: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
    icon: "text-green-600 dark:text-green-400",
    title: "text-green-800 dark:text-green-200",
    message: "text-green-700 dark:text-green-300",
    progress: "bg-green-500",
  },
  error: {
    container: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
    icon: "text-red-600 dark:text-red-400",
    title: "text-red-800 dark:text-red-200",
    message: "text-red-700 dark:text-red-300",
    progress: "bg-red-500",
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
    icon: "text-yellow-600 dark:text-yellow-400",
    title: "text-yellow-800 dark:text-yellow-200",
    message: "text-yellow-700 dark:text-yellow-300",
    progress: "bg-yellow-500",
  },
  info: {
    container: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
    icon: "text-blue-600 dark:text-blue-400",
    title: "text-blue-800 dark:text-blue-200",
    message: "text-blue-700 dark:text-blue-300",
    progress: "bg-blue-500",
  },
};

const NotificationComponent: React.FC<NotificationProps> = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(100);

  const Icon = icons[notification.type];
  const style = styles[notification.type];

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (notification.delay <= 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const elapsed = Date.now() - notification.timestamp;
        const remaining = Math.max(0, ((notification.delay - elapsed) / notification.delay) * 100);
        return remaining;
      });
    }, 50);

    const timer = setTimeout(() => {
      handleRemove();
    }, notification.delay);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [notification.delay, notification.timestamp]);

  const handleRemove = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  }, [notification.id, onRemove]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300 ease-out transform",
        "w-96 max-w-[calc(100vw-2rem)]",
        style.container,
        isVisible && !isLeaving ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95",
        isLeaving && "translate-x-full opacity-0 scale-95"
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Progress bar */}
      {notification.delay > 0 && (
        <div className="absolute top-0 left-0 w-full h-1 bg-black/10 dark:bg-white/10">
          <div
            className={cn("h-full transition-all duration-75 ease-linear", style.progress)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <Icon className={cn("h-5 w-5", style.icon)} />
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <h4 className={cn("text-sm font-semibold", style.title)}>{notification.title}</h4>
            <p className={cn("mt-1 text-sm", style.message)}>{notification.message}</p>
          </div>

          {/* Close button */}
          <button
            onClick={handleRemove}
            className={cn(
              "flex-shrink-0 p-1 rounded-md transition-colors",
              "hover:bg-black/10 dark:hover:bg-white/10",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
            )}
            aria-label="Close notification"
          >
            <X className="h-4 w-4 opacity-60 hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  );
};

class NotificationManager {
  private notifications: NotificationItem[] = [];
  private listeners: ((notifications: NotificationItem[]) => void)[] = [];
  private container: HTMLElement | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.setupContainer();
    }
  }

  private setupContainer() {
    this.container = document.getElementById("notification-portal");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "notification-portal";
      this.container.className = "fixed top-4 right-4 z-[9999] flex flex-col space-y-2 pointer-events-none";
      this.container.style.transform = "translateZ(0)"; // Force hardware acceleration
      document.body.appendChild(this.container);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }

  add(type: NotificationType, title: string, message: string, delay: number = 5000): string {
    const notification: NotificationItem = {
      id: this.generateId(),
      type,
      title,
      message,
      delay,
      timestamp: Date.now(),
    };

    this.notifications.push(notification);
    this.notify();

    return notification.id;
  }

  remove(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  clear() {
    this.notifications = [];
    this.notify();
  }

  subscribe(listener: (notifications: NotificationItem[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getContainer() {
    return this.container;
  }
}

// Global manager instance
const manager = new NotificationManager();

// React component for rendering notifications
export const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const unsubscribe = manager.subscribe((newNotifications) => {
      setNotifications(newNotifications);
    });
    return unsubscribe;
  }, []);

  if (typeof window === "undefined") return null;

  const container = manager.getContainer();
  if (!container) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-auto">
      {notifications.map((notification) => (
        <NotificationComponent
          key={notification.id}
          notification={notification}
          onRemove={manager.remove.bind(manager)}
        />
      ))}
    </div>,
    container
  );
};

// Main notification function (the API you requested)
function notification(type: NotificationType, title: string, message: string, delay: number = 5000): string {
  const id = manager.add(type, title, message, delay);
  return id;
}

// Additional utility functions
notification.success = (title: string, message: string, delay?: number) =>
  notification("success", title, message, delay);

notification.error = (title: string, message: string, delay?: number) => notification("error", title, message, delay);

notification.warning = (title: string, message: string, delay?: number) =>
  notification("warning", title, message, delay);

notification.info = (title: string, message: string, delay?: number) => notification("info", title, message, delay);

notification.clear = () => manager.clear();

export default notification;
