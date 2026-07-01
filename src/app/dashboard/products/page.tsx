import { ProductForm } from "@/components/dashboard/product-form";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category, Product } from "@/lib/types";
import { Package } from "lucide-react";
import { DeleteButtonProduct } from "@/components/dashboard/delete-button";
import Image from "next/image";

const Products = async () => {
  const token = await getToken();

  const [categories, products] = await Promise.all([
    apiClient<Category[]>("/category", {
      token: token!,
    }),
    apiClient<Product[]>("/products?disabled=false", {
      token: token!,
    }),
  ]);

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Produtos
          </h1>
          <p className="text-sm sm:text-base mt-1">Gerencie seus produtos</p>
        </div>

        <ProductForm categories={categories} />
      </div>

      {products.length !== 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-app-card border border-app-border transition-shadow hover:shadow-md text-white rounded-md overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-48 bg-app-background">
                <Image
                  src={product.banner}
                  alt={product.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <CardHeader className="flex-1">
                <CardTitle className="gap-2 flex items-center justify-between text-base md:text-lg">
                  <div className="flex flex-row gap-2 items-center">
                    <Package className="w-5 h-5" />
                    <span className="truncate">{product.name}</span>
                  </div>

                  <DeleteButtonProduct productId={product.id} />
                </CardTitle>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="px-4 py-3 border-t border-app-border">
                    <div className="flex justify-between items-center ">
                      <span className="text-lg font-bold text-brand-primary">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs bg-app-background px-2 py-1 rounded">
                        {product.category?.name}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="w-12 h-12 text-gray-500 mb-4" />
          <p className="text-gray-400">Nenhum produto cadastrado ainda</p>
        </div>
      )}
    </div>
  );
};

export default Products;
