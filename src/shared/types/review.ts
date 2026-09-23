export interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  productId: string;
  product?: { id: string; name: string };
  createdAt?: string;
}
