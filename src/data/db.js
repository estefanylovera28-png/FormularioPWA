import Dexie from 'dexie';

export const db = new Dexie('PreventaOfflineDB');

db.version(1).stores({
  pedidos: '++id, cliente, producto, cantidad, sincronizado, fecha'
});