import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService, SearchResult } from './services/gemini.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly geminiService = inject(GeminiService);

  query = signal('');
  result = signal<SearchResult | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  updateQuery(event: Event) {
    const input = event.target as HTMLInputElement;
    this.query.set(input.value);
  }

  async onSearch() {
    if (!this.query().trim() || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.result.set(null);
    this.error.set(null);

    try {
      const searchResult = await this.geminiService.generateContentWithSearch(this.query());
      this.result.set(searchResult);
    } catch (e: any) {
      this.error.set(e.message || 'একটি অজানা ত্রুটি ঘটেছে।');
    } finally {
      this.loading.set(false);
    }
  }
}
