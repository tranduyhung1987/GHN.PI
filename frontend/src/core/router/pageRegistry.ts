import { lazy } from "react";
import { AppRole, PageKey, PageConfig } from "./types";

export type { AppRole };

export const PAGE_REGISTRY: Record<PageKey, PageConfig> = {
  HOME: {
    key: "HOME",
    path: "/",
    component: lazy(() => import("@/pages/HomePage")),
    roles: ["guest", "buyer", "seller", "driver"],
  },

  LOGIN: {
    key: "LOGIN",
    path: "/login",
    component: lazy(() => import("@/pages/LoginPage")),
    roles: ["guest"],
  },

  DASHBOARD: {
    key: "DASHBOARD",
    path: "/dashboard",
    component: lazy(() => import("@/pages/DashboardPage")),
    roles: ["buyer", "seller", "admin"],
  },

  ORDER: {
    key: "ORDER",
    path: "/order",
    component: lazy(() => import("@/pages/OrderPage")),
    roles: ["buyer", "seller"],
  },

  TRACKING: {
    key: "TRACKING",
    path: "/tracking",
    component: lazy(() => import("@/pages/TrackingPage")),
    roles: ["buyer", "seller", "driver"],
  },

  WAREHOUSE: {
    key: "WAREHOUSE",
    path: "/warehouse",
    component: lazy(() => import("@/pages/WarehousePage")),
    roles: ["seller", "admin"],
  },

  DRIVER: {
    key: "DRIVER",
    path: "/driver",
    component: lazy(() => import("@/pages/DriverPage")),
    roles: ["driver"],
  },

  PROFILE: {
    key: "PROFILE",
    path: "/profile",
    component: lazy(() => import("@/pages/ProfilePage")),
    roles: ["buyer", "seller", "driver", "admin"],
  },
};