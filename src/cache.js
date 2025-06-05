export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('factcheck-cache', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      const store = db.createObjectStore('claims', { keyPath: 'id' });
      store.createIndex('ts', 'ts', { unique: false });
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getCached(db, id) {
  return new Promise((resolve) => {
    const tx = db.transaction('claims');
    const store = tx.objectStore('claims');
    const req = store.get(id);
    req.onsuccess = () => {
      const res = req.result;
      if (res && Date.now() - res.ts < 7 * 24 * 3600 * 1000) {
        resolve(res.data);
      } else {
        resolve(null);
      }
    };
    req.onerror = () => resolve(null);
  });
}

export async function setCached(db, id, data) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('claims', 'readwrite');
    tx.objectStore('claims').put({ id, data, ts: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
