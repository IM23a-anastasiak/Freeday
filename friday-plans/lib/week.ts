// e.g. "2025-08-22" for the upcoming Friday of this week
export function currentFridayKey(): string {
    const now = new Date();
    const day = now.getDay(); // 0 Sun ... 6 Sat
    const diff = (5 - day + 7) % 7; // days until Friday
    const friday = new Date(now);
    friday.setHours(0, 0, 0, 0);
    friday.setDate(now.getDate() + diff);
    return friday.toISOString().slice(0, 10);
  }
  