/**
 * Fixtures realistas, no formato do contrato da API (fase 3):
 * datas ISO UTC com `Z`, página `{content, page}`, fotos com URL relativa `/api/v1/files/...`.
 */

export const ADMIN = {
  id: 1,
  name: "Administrador",
  email: "admin@local.dev",
  username: "admin",
  active: true,
  roles: [
    { id: 1, name: "ADMIN", permissions: [{ id: 1, name: "READ_PRIVILEGES" }, { id: 2, name: "WRITE_PRIVILEGES" }] },
    { id: 2, name: "USER", permissions: [{ id: 1, name: "READ_PRIVILEGES" }] },
  ],
};

export const COMMON_USER = {
  id: 2,
  name: "Usuário Teste",
  email: "usuario@local.dev",
  username: "usuario",
  active: true,
  roles: [{ id: 2, name: "USER", permissions: [{ id: 1, name: "READ_PRIVILEGES" }] }],
};

export const CREDENTIALS = {
  admin: { username: "admin", password: "Admin@123" },
  user: { username: "usuario", password: "Usuario@123" },
};

export type ReviewFixture = {
  id: number;
  title: string;
  description: string;
  note: number;
  productId: number;
  productName: string;
  productSlug: string;
  userId: number;
  userName: string;
  userUsername: string;
  createdAt: string;
  helpfulCount: number;
  helpfulByMe: boolean;
  status: "VISIBLE" | "HIDDEN";
  moderationReason: string | null;
  moderatedAt: string | null;
  moderatedByName: string | null;
  images: { id: number; url: string }[];
  reportedByMe: boolean;
  reportsCount: number;
  reply: { text: string; authorName: string; repliedAt: string } | null;
};

const review = (data: Partial<ReviewFixture> & Pick<ReviewFixture, "id" | "title" | "description" | "note">): ReviewFixture => ({
  productId: 1,
  productName: "Smartphone X",
  productSlug: "smartphone-x",
  userId: 2,
  userName: "Usuário Teste",
  userUsername: "usuario",
  createdAt: "2026-10-01T23:14:44Z",
  helpfulCount: 0,
  helpfulByMe: false,
  status: "VISIBLE",
  moderationReason: null,
  moderatedAt: null,
  moderatedByName: null,
  images: [],
  reportedByMe: false,
  reportsCount: 0,
  reply: null,
  ...data,
});

export const REVIEWS: ReviewFixture[] = [
  review({
    id: 12,
    title: "Promoção imperdível",
    description: "Compre mais barato no meu site, link na bio!!! Melhor preço do Brasil.",
    note: 5,
    productId: 3,
    productName: "Cafeteira Express",
    productSlug: "cafeteira-express",
    userId: 7,
    userName: "Loja Relâmpago",
    userUsername: "lojarelampago",
    createdAt: "2026-10-02T13:05:10Z",
    reportsCount: 3,
  }),
  review({
    id: 11,
    title: "Produto horrível, vendedor idiota",
    description: "Não comprem. Quem vende isso é um idiota e não sabe o que faz.",
    note: 1,
    productId: 37,
    productName: "Café Em Cápsula Torrado E Moído Intenso Espresso Illy",
    productSlug: "cafe-em-capsula-illy-8003753158761",
    userId: 8,
    userName: "Carlos Mendes",
    userUsername: "carlosm",
    createdAt: "2026-10-02T11:42:00Z",
    reportsCount: 1,
  }),
  review({
    id: 10,
    title: "Ótimo custo-benefício",
    description: "Tela bonita, bateria aguenta o dia todo e a câmera surpreende de noite.",
    note: 4,
    createdAt: "2026-10-02T10:20:00Z",
    helpfulCount: 6,
    userId: 9,
    userName: "Ana Paula Souza",
    userUsername: "anapaula",
    images: [
      { id: 21, url: "/api/v1/files/reviews/10/frente.jpg" },
      { id: 22, url: "/api/v1/files/reviews/10/verso.jpg" },
    ],
  }),
  review({
    id: 9,
    title: "Esquenta um pouco",
    description: "Depois de uns 20 minutos de jogo fica bem quente. No resto, ótimo.",
    note: 3,
    createdAt: "2026-10-01T23:14:49Z",
    helpfulCount: 2,
    images: [{ id: 7, url: "/api/v1/files/reviews/9/foto.jpg" }],
    reply: {
      text: "Obrigado pelo retorno! Repassamos o ponto sobre o aquecimento para o fabricante.",
      authorName: "Administrador",
      repliedAt: "2026-10-02T14:12:27Z",
    },
  }),
  review({
    id: 8,
    title: "Café encorpado",
    description: "Aroma forte e sem amargor. Virou o café da casa.",
    note: 5,
    productId: 29,
    productName: "Nescafe Classic",
    productSlug: "nescafe-classic-7891000071786",
    createdAt: "2026-09-30T18:00:00Z",
    userId: 9,
    userName: "Ana Paula Souza",
    userUsername: "anapaula",
  }),
  review({
    id: 7,
    title: "Chegou quebrado",
    description: "A embalagem veio amassada e a jarra trincada. Troca demorou duas semanas.",
    note: 2,
    productId: 3,
    productName: "Cafeteira Express",
    productSlug: "cafeteira-express",
    createdAt: "2026-09-29T12:30:00Z",
    userId: 8,
    userName: "Carlos Mendes",
    userUsername: "carlosm",
  }),
  review({
    id: 6,
    title: "Texto copiado de outro site",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    note: 4,
    createdAt: "2026-09-28T09:00:00Z",
    status: "HIDDEN",
    moderationReason: "Conteúdo copiado, sem relação com o produto",
    moderatedAt: "2026-10-02T09:10:00Z",
    moderatedByName: "Administrador",
    userId: 7,
    userName: "Loja Relâmpago",
    userUsername: "lojarelampago",
  }),
  review({
    id: 5,
    title: "Bateria dura o dia todo",
    description: "Uso intenso e ainda chego em casa com 30%.",
    note: 5,
    createdAt: "2026-09-27T21:00:00Z",
    helpfulCount: 4,
  }),
];

export const REPORTS: Record<number, { id: number; reason: string; details: string | null; reporterName: string; createdAt: string }[]> = {
  12: [
    { id: 31, reason: "SPAM", details: "Propaganda de outra loja com link.", reporterName: "Ana Paula Souza", createdAt: "2026-10-02T13:20:00Z" },
    { id: 32, reason: "SPAM", details: null, reporterName: "Carlos Mendes", createdAt: "2026-10-02T13:40:00Z" },
    { id: 33, reason: "FALSE_INFORMATION", details: "O preço citado não existe.", reporterName: "Usuário Teste", createdAt: "2026-10-02T14:02:00Z" },
  ],
  11: [
    { id: 34, reason: "OFFENSIVE", details: "Ofende o vendedor.", reporterName: "Ana Paula Souza", createdAt: "2026-10-02T12:00:00Z" },
  ],
};

export const PRODUCTS = [
  { id: 1, name: "Smartphone X", description: "Celular com tela de 6,5\"", slug: "smartphone-x", subCategorieId: 1, subCategorieName: "Celulares", categoryId: 1, categoryName: "Eletrônicos", imageUrl: null, averageNote: 4.3, totalReviews: 4, createdAt: "2026-09-01T12:00:00Z" },
  { id: 3, name: "Cafeteira Express", description: "Cafeteira elétrica", slug: "cafeteira-express", subCategorieId: 3, subCategorieName: "Cozinha", categoryId: 2, categoryName: "Casa", imageUrl: null, averageNote: 3.5, totalReviews: 2, createdAt: "2026-09-01T12:00:00Z" },
  { id: 29, name: "Nescafe Classic", description: "Marca: Nescafé · 200g", slug: "nescafe-classic-7891000071786", subCategorieId: 6, subCategorieName: "Cafés", categoryId: 5, categoryName: "Bebidas", imageUrl: null, averageNote: 5, totalReviews: 1, createdAt: "2026-10-02T03:10:00Z" },
  { id: 37, name: "Café Em Cápsula Torrado E Moído Intenso Espresso Illy", description: "Marca: Illy · 57g", slug: "cafe-em-capsula-illy-8003753158761", subCategorieId: 6, subCategorieName: "Cafés", categoryId: 5, categoryName: "Bebidas", imageUrl: null, averageNote: 1, totalReviews: 1, createdAt: "2026-10-02T03:10:00Z" },
];

const days = (count: number) =>
  Array.from({ length: count }, (_, i) => {
    const date = new Date(Date.UTC(2026, 9, 2 - (count - 1 - i)));
    return date.toISOString().slice(0, 10);
  });

export const stats = (period = 30) => {
  const list = days(period);
  return {
    totals: { products: 144, categories: 6, subCategories: 15, reviews: 7, hiddenReviews: 1, users: 9 },
    averageNote: 3.9,
    ratingDistribution: { "1": 1, "2": 1, "3": 1, "4": 1, "5": 3 },
    reviewsPerDay: list.map((date, i) => ({ date, count: i >= list.length - 4 ? [1, 1, 2, 3][i - (list.length - 4)] : 0, averageNote: i >= list.length - 4 ? 4 : null })),
    usersPerDay: list.map((date, i) => ({ date, count: i % 9 === 0 ? 1 : 0 })),
    topProducts: [
      { id: 1, name: "Smartphone X", slug: "smartphone-x", totalReviews: 4, averageNote: 4.3 },
      { id: 3, name: "Cafeteira Express", slug: "cafeteira-express", totalReviews: 2, averageNote: 3.5 },
    ],
    topCategories: [
      { id: 1, name: "Eletrônicos", totalReviews: 4, averageNote: 4.3 },
      { id: 5, name: "Bebidas", totalReviews: 2, averageNote: 3 },
    ],
  };
};

export const ADMIN_USERS = [
  { id: 1, name: "Administrador", username: "admin", email: "admin@local.dev", active: true, roles: ["ADMIN", "USER"], createdAt: "2026-09-01T12:00:00Z", reviewsCount: 0 },
  { id: 2, name: "Usuário Teste", username: "usuario", email: "usuario@local.dev", active: true, roles: ["USER"], createdAt: "2026-09-01T12:05:00Z", reviewsCount: 4 },
  { id: 9, name: "Ana Paula Souza", username: "anapaula", email: "ana@exemplo.com", active: true, roles: ["USER"], createdAt: "2026-09-20T15:00:00Z", reviewsCount: 2 },
];

export const ACTIVITY = [
  { id: "a1", eventId: "e1", type: "REVIEW_REPORTED", action: "Avaliação denunciada", message: "Usuário Teste denunciou a avaliação \"Promoção imperdível\"", nameUser: "Usuário Teste", userId: 2, entityType: "REVIEW", entityId: "12", occurredAt: "2026-10-02T14:02:00Z", receivedAt: "2026-10-02T14:02:01Z" },
  { id: "a2", eventId: "e2", type: "REVIEW_REPLIED", action: "Avaliação respondida", message: "Administrador respondeu a avaliação \"Esquenta um pouco\"", nameUser: "Administrador", userId: 1, entityType: "REVIEW", entityId: "9", occurredAt: "2026-10-02T14:12:27Z", receivedAt: "2026-10-02T14:12:28Z" },
  { id: "a3", eventId: "e3", type: "CATALOG_DEDUPLICATED", action: "Produtos duplicados removidos", message: "Administrador removeu 3 produtos duplicados", nameUser: "Administrador", userId: 1, entityType: "PRODUCT", entityId: null, occurredAt: "2026-10-02T12:00:00Z", receivedAt: "2026-10-02T12:00:01Z" },
];

export const IMPORT_JOB = {
  id: "8d0f7a5e-0d7c-4a55-9d0f-1f2a3b4c5d6e",
  source: "OPEN_FOOD_FACTS",
  status: "COMPLETED",
  totalSteps: 12,
  completedSteps: 12,
  currentStep: null,
  categoriesCreated: 4,
  subCategoriesCreated: 12,
  productsCreated: 144,
  productsSkipped: 0,
  imagesCreated: 144,
  errors: [],
  startedAt: "2026-10-02T03:10:00Z",
  finishedAt: "2026-10-02T03:12:10Z",
  startedBy: "Administrador",
};

export const DEDUPE_RESULT = { groups: 2, removed: 3, keptIds: [7, 53], removedIds: [9, 61, 62] };

export const SUGGESTIONS = PRODUCTS.map(({ id, name, slug, imageUrl, categoryName }) => ({ id, name, slug, imageUrl, categoryName }));

/** PNG 8×8 (cinza) para as fotos das avaliações. */
export const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEUlEQVR4nGPYs3c/VsQwtCQAe0GOAViZp4QAAAAASUVORK5CYII=",
  "base64"
);
