import { describe, expect, it } from 'vitest';
import {
  BOOK_LANDMARKS,
  TOTAL_BOOK_PAGES,
  findLandmarkForPage,
  getNearestLandmark,
  getPageImageUrl,
} from './bookLandmarks';

describe('bookLandmarks domain logic', () => {
  it('has total book pages defined as 216', () => {
    expect(TOTAL_BOOK_PAGES).toBe(216);
  });

  it('formats image URLs correctly and clamps boundaries', () => {
    // Normal cases
    expect(getPageImageUrl(1)).toMatch(/book_pages\/page_001\.webp$/);
    expect(getPageImageUrl(16)).toMatch(/book_pages\/page_016\.webp$/);
    expect(getPageImageUrl(216)).toMatch(/book_pages\/page_216\.webp$/);

    // Out of bounds clamping
    expect(getPageImageUrl(0)).toMatch(/book_pages\/page_001\.webp$/);
    expect(getPageImageUrl(-5)).toMatch(/book_pages\/page_001\.webp$/);
    expect(getPageImageUrl(250)).toMatch(/book_pages\/page_216\.webp$/);

    // Floating numbers
    expect(getPageImageUrl(16.7)).toMatch(/book_pages\/page_016\.webp$/);
  });

  it('contains all required curriculum landmarks from the specification', () => {
    const requiredSpecs: Array<{ page: number; titleEnKeyword: string }> = [
      { page: 10, titleEnKeyword: 'C Position' },
      { page: 16, titleEnKeyword: 'Ode to Joy' },
      { page: 20, titleEnKeyword: 'C Major Scale' },
      { page: 33, titleEnKeyword: 'Scarborough Fair' },
      { page: 34, titleEnKeyword: 'Chopsticks' },
      { page: 54, titleEnKeyword: 'G Major Scale' },
      { page: 84, titleEnKeyword: 'Cut Common Time' },
      { page: 116, titleEnKeyword: '12-Bar Blues' },
      { page: 185, titleEnKeyword: 'Modes' },
    ];

    for (const spec of requiredSpecs) {
      const match = BOOK_LANDMARKS.find((lm) => lm.page === spec.page);
      expect(match, `Missing landmark for page ${spec.page}`).toBeDefined();
      expect(match?.titleEn).toContain(spec.titleEnKeyword);
    }
  });

  it('findLandmarkForPage returns exact landmark or undefined', () => {
    const p16 = findLandmarkForPage(16);
    expect(p16?.titleEn).toContain('Ode to Joy');

    const p99 = findLandmarkForPage(99);
    expect(p99).toBeUndefined();
  });

  it('getNearestLandmark resolves closest preceding or equal landmark', () => {
    // Exact match
    expect(getNearestLandmark(16).page).toBe(16);

    // In between 16 (Lesson 2) and 18 (Lesson 3)
    expect(getNearestLandmark(17).page).toBe(16);

    // Page 200 (before appendix 208)
    expect(getNearestLandmark(200).page).toBe(185);

    // Page 216 (after appendix 208)
    expect(getNearestLandmark(216).page).toBe(208);
  });

  it('all landmark pages are in the 1 to 216 range and have bilingual metadata', () => {
    for (const lm of BOOK_LANDMARKS) {
      expect(lm.page).toBeGreaterThanOrEqual(1);
      expect(lm.page).toBeLessThanOrEqual(TOTAL_BOOK_PAGES);
      expect(lm.titleEn.length).toBeGreaterThan(0);
      expect(lm.titleLt.length).toBeGreaterThan(0);
      expect(lm.lesson.length).toBeGreaterThan(0);
    }
  });
});
