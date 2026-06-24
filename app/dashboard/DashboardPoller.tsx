"use client";

import { useEffect, useCallback, useRef, useState } from "react";

interface OrderRow {
  id: string;
  orderNumber: string;
  fileName: string;
  material: string;
  tech: string;
  color: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  estimatedDelivery: string | null;
}

export function useDashboardPoller(initialOrders: OrderRow[]) {
  const [activeOrders, setActiveOrders] = useState<OrderRow[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>(initialOrders);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const [activeRes, recentRes] = await Promise.all([
        fetch("/api/orders?status=active"),
        fetch("/api/orders?limit=5"),
      ]);
      if (activeRes.ok) {
        const data = await activeRes.json();
        setActiveOrders(data.orders || []);
      }
      if (recentRes.ok) {
        const data = await recentRes.json();
        setRecentOrders(data.orders || []);
      }
    } catch {
      // Silent fail for polling
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchOrders();

    // Poll every 15s when visible
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchOrders();
        intervalRef.current = setInterval(fetchOrders, 15000);
      } else if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchOrders]);

  return { activeOrders, recentOrders };
}
