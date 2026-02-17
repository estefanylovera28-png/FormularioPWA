import { useEffect } from 'react';
import { db } from '../data/db';

export const useSync = () => {
  const sincronizarPedidos = async () => {
    // 1. Buscamos en la DB local los pedidos que tengan sincronizado: 0
    const pedidosPendientes = await db.pedidos
      .where('sincronizado')
      .equals(0)
      .toArray();

    if (pedidosPendientes.length > 0) {
      console.log(`Sincronizando ${pedidosPendientes.length} pedidos...`);
      
      for (const pedido of pedidosPendientes) {
        try {
          // 2. Aquí harías el fetch a tu API de Node.js (MakingPIT)
          // const response = await fetch('tu-api/pedidos', { method: 'POST', body: JSON.stringify(pedido) });
          
          // 3. Si se envía con éxito, lo marcamos como sincronizado: 1
          await db.pedidos.update(pedido.id, { sincronizado: 1 });
        } catch (error) {
          console.error("Fallo al enviar pedido:", error);
        }
      }
    }
  };

  useEffect(() => {
    // Escuchamos cuando el navegador detecta que vuelve el internet
    window.addEventListener('online', sincronizarPedidos);
    
    return () => window.removeEventListener('online', sincronizarPedidos);
  }, []);
};