"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon, RefreshCcw } from "lucide-react";
import { Order } from "@/lib/types";
import { apiClient } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { OrderModal } from "./order-modal";
import { toast } from "sonner";

interface OrdersProps {
  token: string;
}

const Orders = ({ token }: OrdersProps) => {
  const [loading, setLoading] = useState(true);
  const [isloadingButton, setIsLoadingButton] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoadingButton(true);

    try {
      const response = await apiClient<Order[]>("/orders?draft=false", {
        method: "GET",
        cache: "no-store",
        token: token,
      });

      const pendingOrders = response.filter((order) => !order.status);

      setOrders(pendingOrders);
      setLoading(false);
      setIsLoadingButton(false);
    } catch (err) {
      setLoading(false);
      setIsLoadingButton(false);
      console.log(err);
    }
  };

  useEffect(() => {
    async function loadOrders() {
      await fetchOrders();
    }

    loadOrders();
  }, []);

  const calculateOrderTotal = (order: Order) => {
    if (!order.items) return 0;

    return order.items.reduce((total, item) => {
      return total + item.product.price * item.amount;
    }, 0);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Pedidos em produção
          </h1>
          <p className="text-sm sm:text-base mt-1">
            Gerencie os pedidos da conzinha
          </p>
        </div>
        <Button
          className="bg-brand-primary text-white rounded-md hover:to-brand-primary"
          onClick={fetchOrders}
        >
          <div>
            {isloadingButton ? (
              <div>
                <RefreshCcw className={isloadingButton ? "animate-spin" : ""} />
              </div>
            ) : (
              <div>
                <RefreshCcw />
              </div>
            )}
          </div>
        </Button>
      </div>

      {loading ? (
        <div className="w-full h-[calc(100dvh-250px)] flex gap-2 items-center justify-center">
          <Spinner className="size-6" />
          <p className="text-gray-300">Carregando pedidos</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="w-full h-[calc(100dvh-250px)] flex gap-2 items-center justify-center">
          <p className="text-gray-300">Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="bg-app-card border border-app-border text-white rounded-md mt-5"
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg lg:text-xl font-bold">
                    Mesa {order.table}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="text-xs rounded-full select-none"
                  >
                    Em produção
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 sm:space-y-4 mt-auto">
                <div>
                  {order.items && order.items.length > 0 && (
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item) => (
                        <p
                          key={item.id}
                          className="text-xs sm:text-sm text-gray-300 truncate"
                        >
                          -{item.amount}x {item.product.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col xl:flex-row items-center justify-between pt-4 border-t border-app-border gap-3">
                  <div className="self-start">
                    <p className="text-sm md:text-base text-gray-300">Total</p>
                    <p className="text-base font-bold text-brand-primary">
                      {formatPrice(calculateOrderTotal(order))}
                    </p>
                  </div>
                  <Button
                    className="bg-brand-primary hover:bg-brand-primary rounded-md w-full xl:w-auto p-4"
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    <EyeIcon className="w-5 h-5" />
                    Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <OrderModal
        orderId={selectedOrder}
        token={token}
        onClose={async () => {
          setSelectedOrder(null);
          await fetchOrders();
        }}
      />
    </div>
  );
};

export { Orders };
