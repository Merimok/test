// Simple IndexedDB wrapper for caching verdicts
const DB_NAME = 'factcheck-cache';
const STORE = 'verdicts';
const BOOKMARKS = 'bookmarks';
const DB_VERSION = 2;
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'hash' });
      }
      if (!db.objectStoreNames.contains(BOOKMARKS)) {
        db.createObjectStore(BOOKMARKS, { keyPath: 'url' });
      }
    };

    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
  });
}

export async function getCachedVerdict(hash) {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req = store.get(hash);
    req.onsuccess = () => {
      const entry = req.result;
      if (entry && Date.now() < entry.expiry) {
        resolve(entry.verdict);
      } else {
        resolve(null);
      }
    };
    req.onerror = () => resolve(null);
  });
}

export async function storeVerdict(hash, verdict) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    const store = tx.objectStore(STORE);
    store.put({ hash, verdict, expiry: Date.now() + EXPIRY_MS });
  });
}

export async function addBookmark(url, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BOOKMARKS, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    const store = tx.objectStore(BOOKMARKS);
    store.put({ url, data, saved: Date.now() });
  });
}

export async function getBookmarks() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(BOOKMARKS, 'readonly');
    const store = tx.objectStore(BOOKMARKS);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });
}
