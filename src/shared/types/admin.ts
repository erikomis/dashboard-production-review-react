import { Page } from "./api";

// ---------- Usuários (/admin/users) ----------

export interface AdminUser {
  id: number;
  name: string;
  username: string;
  email: string;
  active: boolean;
  roles: string[];
  createdAt?: string;
  reviewsCount: number;
}

export type AdminUserPage = Page<AdminUser>;

// ---------- Estatísticas (/admin/stats) ----------

export interface StatsTotals {
  products: number;
  categories: number;
  subCategories: number;
  reviews: number;
  hiddenReviews: number;
  users: number;
}

export interface ReviewsPerDay {
  date: string;
  count: number;
  averageNote: number | null;
}

export interface CountPerDay {
  date: string;
  count: number;
}

export interface TopProduct {
  id: number;
  name: string;
  slug: string;
  totalReviews: number;
  averageNote: number | null;
}

export interface TopCategory {
  id: number;
  name: string;
  totalReviews: number;
  averageNote: number | null;
}

export interface AdminStats {
  totals: StatsTotals;
  averageNote: number;
  ratingDistribution: Record<string, number>;
  reviewsPerDay: ReviewsPerDay[];
  usersPerDay: CountPerDay[];
  topProducts: TopProduct[];
  topCategories: TopCategory[];
}

// ---------- Importação (/admin/import) ----------

export type ImportStatus = "RUNNING" | "COMPLETED" | "FAILED";

export interface ImportJob {
  id: string;
  source: string;
  status: ImportStatus;
  totalSteps: number;
  completedSteps: number;
  currentStep: string | null;
  categoriesCreated: number;
  subCategoriesCreated: number;
  productsCreated: number;
  productsSkipped: number;
  imagesCreated: number;
  errors: string[];
  startedAt: string;
  finishedAt: string | null;
  startedBy: string | null;
}

// ---------- Auditoria (/admin/activity) ----------

export type ActivityEntityType =
  | "USER"
  | "CATEGORY"
  | "SUBCATEGORY"
  | "PRODUCT"
  | "PRODUCT_IMAGE"
  | "REVIEW"
  | "IMPORT";

export interface ActivityEntry {
  id: string;
  eventId?: string | null;
  type: string;
  action: string | null;
  message: string | null;
  nameUser: string | null;
  userId: number | null;
  entityType: string | null;
  entityId: string | null;
  occurredAt: string;
  receivedAt?: string;
}

export type ActivityPage = Page<ActivityEntry>;

export interface ActivitySummary {
  total: number;
  byType: { type: string; count: number }[];
  byDay: CountPerDay[];
}

export interface ActivityFilters {
  type?: string;
  entityType?: string;
  search?: string;
  /** `YYYY-MM-DD` */
  from?: string;
  /** `YYYY-MM-DD` */
  to?: string;
}
