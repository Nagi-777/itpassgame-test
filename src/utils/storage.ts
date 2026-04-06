import type { AppData, TestRecord } from '../types';

const KEY = 'itptest_data';

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch {
    // fall through
  }
  return { testHistory: [], reviewQueue: [] };
}

export function saveData(data: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function addHistory(record: TestRecord): void {
  const data = loadData();
  data.testHistory = [record, ...data.testHistory].slice(0, 50);
  saveData(data);
}

export function addToReviewQueue(ids: string[]): void {
  const data = loadData();
  const existing = new Set(data.reviewQueue);
  for (const id of ids) existing.add(id);
  data.reviewQueue = Array.from(existing);
  saveData(data);
}

export function removeFromReviewQueue(ids: string[]): void {
  const data = loadData();
  const toRemove = new Set(ids);
  data.reviewQueue = data.reviewQueue.filter(id => !toRemove.has(id));
  saveData(data);
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export { todayStr };
