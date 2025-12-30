
export class CreateProductDto {
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  currency?: string;
  stock: number;
  category: string;

  diameterInches?: number;
  heightInches?: number;
  weightLbs?: number;
  material?: string;
  finish?: string;
  includedItems?: string;

  thumbnail?: string;
  images?: string[];
}
