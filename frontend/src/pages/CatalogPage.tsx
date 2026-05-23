import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '../api/menu.api';
import { useCreateOrder } from '../api/orders.api';
import { Loader2, Plus, Minus, ShoppingCart, CheckCircle } from 'lucide-react';

export const CatalogPage = () => {
  const navigate = useNavigate();
  const { data: products, isLoading } = useCatalog();
  const createOrder = useCreateOrder();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [lastOrder, setLastOrder] = useState<string | null>(null);

  const updateQty = (sku: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [sku]: Math.max(1, (prev[sku] || 1) + delta)
    }));
  };

  const handleOrder = async (product: any) => {
    const qty = quantities[product.sku] || 1;
    const clientOrderId = crypto.randomUUID();
    
    try {
      await createOrder.mutateAsync({
        clientOrderId,
        total: product.price * qty,
        items: [{ productId: product.sku, quantity: qty }]
      });
      setLastOrder(product.sku);
      // Redirigir a pedidos después de 1 segundo para que el usuario vea el feedback
      setTimeout(() => {
        navigate('/orders');
      }, 1000);
    } catch (err) {
      alert("Error al crear el pedido");
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-orange-600" /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Carta de Productos</h1>
        <p className="text-gray-500 mt-2">Selecciona tus favoritos y pide ahora mismo.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">SKU: {product.sku}</p>
                </div>
                <span className="text-xl font-black text-orange-600">Q{product.price}</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-6 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button onClick={() => updateQty(product.sku, -1)} className="p-1 hover:text-orange-600 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantities[product.sku] || 1}</span>
                  <button onClick={() => updateQty(product.sku, 1)} className="p-1 hover:text-orange-600 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleOrder(product)}
                  disabled={createOrder.isPending || lastOrder === product.sku}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                    lastOrder === product.sku
                      ? 'bg-green-500 text-white'
                      : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
                  }`}
                >
                  {lastOrder === product.sku ? <CheckCircle className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  {lastOrder === product.sku ? 'Pedido!' : 'Pedir'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
