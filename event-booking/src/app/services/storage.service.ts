import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getItem(key: string): string | null {
    if (!this.isBrowser()) {
      return null;
    }
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    if (!this.isBrowser()) {
      return;
    }
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    if (!this.isBrowser()) {
      return;
    }
    localStorage.removeItem(key);
  }

  clear(): void {
    if (!this.isBrowser()) {
      return;
    }
    localStorage.clear();
  }
}
