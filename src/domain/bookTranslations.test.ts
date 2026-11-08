import { describe, expect, it } from 'vitest';
import {
  BOOK_TRANSLATIONS,
  getPageTranslation,
} from './bookTranslations';

describe('bookTranslations domain logic', () => {
  it('returns exact translation entries for landmark pages', () => {
    const p10 = getPageTranslation(10);
    expect(p10.isExact).toBe(true);
    expect(p10.entry.page).toBe(10);
    expect(p10.entry.lessonTag).toBe('1 Pamoka');
    expect(p10.entry.titleLt).toContain('C padėtis');
    expect(p10.entry.instructionsLt.length).toBeGreaterThan(0);

    const p16 = getPageTranslation(16);
    expect(p16.isExact).toBe(true);
    expect(p16.entry.titleLt).toContain('Odė džiaugsmui');
    expect(p16.entry.audioPreview).toBeDefined();

    const p20 = getPageTranslation(20);
    expect(p20.isExact).toBe(true);
    expect(p20.entry.titleLt).toContain('C mažoro gama');

    const p116 = getPageTranslation(116);
    expect(p116.isExact).toBe(true);
    expect(p116.entry.titleLt).toContain('12 taktų bliuzas');
  });

  it('correctly derives fallback translation for in-between pages', () => {
    // Page 11 is right after page 10 (Lesson 1)
    const p11 = getPageTranslation(11);
    expect(p11.isExact).toBe(false);
    expect(p11.derivedFromPage).toBe(10);
    expect(p11.entry.page).toBe(11);
    expect(p11.entry.lessonTag).toContain('1 Pamoka');
    expect(p11.entry.lessonTag).toContain('tęsinys');
    expect(p11.entry.summaryLt).toContain('1 Pamoka');

    // Page 17 is right after page 16 (Ode to Joy)
    const p17 = getPageTranslation(17);
    expect(p17.isExact).toBe(false);
    expect(p17.derivedFromPage).toBe(16);
    expect(p17.entry.titleLt).toContain('Odė džiaugsmui');

    // Page 216 is after page 208
    const p216 = getPageTranslation(216);
    expect(p216.derivedFromPage).toBe(208);
  });

  it('clamps out-of-range pages gracefully', () => {
    const pZero = getPageTranslation(0);
    expect(pZero.entry.page).toBe(1);

    const pNegative = getPageTranslation(-10);
    expect(pNegative.entry.page).toBe(1);

    const pTooLarge = getPageTranslation(999);
    expect(pTooLarge.entry.page).toBe(216);
  });

  it('all translation entries have non-empty Lithuanian content and valid tips', () => {
    for (const [pageStr, entry] of Object.entries(BOOK_TRANSLATIONS)) {
      const page = Number(pageStr);
      expect(entry.page).toBe(page);
      expect(entry.titleLt.trim().length).toBeGreaterThan(0);
      expect(entry.summaryLt.trim().length).toBeGreaterThan(0);
      expect(entry.instructionsLt.length).toBeGreaterThan(0);
    }
  });
});
