import React, { useState, useEffect } from 'react';
import { db } from '../data/db';
import { useLiveQuery } from "dexie-react-hooks";

export const FormularioPreventa = () => {
  const [formData, setFormData] = useState({ cliente: '', producto: '', cantidad: 1 });
  const [pedidosServidor, setPedidosServidor] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const pedidosLocales = useLiveQuery(() => db.pedidos.toArray());

  // Función para traer datos del servidor a la pantalla
  const actualizarPanelCentral = async () => {
    try {
      const url = window.location.hostname === 'localhost' 
        ? 'http://localhost:3001/api/pedidos' 
        : 'http://192.168.0.26:3001/api/pedidos';
      const res = await fetch(url);
      const data = await res.json();
      setPedidosServidor(data);
    } catch (e) { console.log("Buscando servidor..."); }
  };

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    const intervalo = setInterval(actualizarPanelCentral, 3000); // Actualiza cada 3 seg
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
      clearInterval(intervalo);
    };
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    await db.pedidos.add({ ...formData, sincronizado: 0, fecha: new Date().toISOString() });
    setFormData({ cliente: '', producto: '', cantidad: 1 });
  };

  const sincronizar = async () => {
    const pendientes = await db.pedidos.where('sincronizado').equals(0).toArray();
    for (const p of pendientes) {
      const res = await fetch('http://192.168.0.26:3001/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (res.ok) await db.pedidos.update(p.id, { sincronizado: 1 });
    }
    actualizarPanelCentral();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', fontFamily: 'Arial' }}>
      <div style={{ background: isOnline ? '#d4edda' : '#f8d7da', padding: '10px', textAlign: 'center', borderRadius: '5px', marginBottom: '10px' }}>
        <strong>{isOnline ? '🟢 MODO ONLINE' : '🔴 MODO OFFLINE'}</strong>
      </div>

      <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ textAlign: 'center' }}>Preventa MakingPIT</h2>
        <input style={{ padding: '12px' }} type="text" placeholder="Cliente" value={formData.cliente} onChange={e => setFormData({...formData, cliente: e.target.value})} required />
        <input style={{ padding: '12px' }} type="text" placeholder="Producto" value={formData.producto} onChange={e => setFormData({...formData, producto: e.target.value})} required />
        <button type="submit" style={{ padding: '15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>GUARDAR PEDIDO</button>
      </form>

      <button onClick={sincronizar} style={{ marginTop: '10px', width: '100%', padding: '15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
        SINCRONIZAR CON SERVIDOR
      </button>

      <div style={{ marginTop: '20px' }}>
        <h4>📦 Registros de este equipo:</h4>
        {pedidosLocales?.map(p => (
          <div key={p.id} style={{ borderBottom: '1px solid #eee', padding: '5px' }}>
            {p.cliente} - {p.producto} {p.sincronizado ? '✅' : '⏳'}
          </div>
        ))}
      </div>

      {/* PANEL CENTRAL: Esto es lo que te falta en la lap */}
      <div style={{ marginTop: '25px', background: '#343a40', color: 'white', padding: '15px', borderRadius: '10px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#ffc107' }}>🖥️ Servidor Central (Laptop)</h4>
        {pedidosServidor.map((p, i) => (
          <div key={i} style={{ background: '#495057', margin: '5px 0', padding: '10px', borderRadius: '5px', borderLeft: '4px solid #ffc107' }}>
            <strong>{p.cliente}</strong> - {p.producto}
          </div>
        ))}
      </div>
    </div>
  );
};