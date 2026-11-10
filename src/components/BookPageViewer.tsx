import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BOOK_LANDMARKS,
  BookLandmark,
  TOTAL_BOOK_PAGES,
  findLandmarkForPage,
  getNearestLandmark,
  getPageImageUrl,
} from '../domain/bookLandmarks';
import { playNote } from '../domain/audio';
import { getPageTranslation } from '../domain/bookTranslations';
import { Language } from '../domain/types';

export interface BookPageViewerProps {
  initialPage?: number;
  language: Language;
  onClose?: () => void;
  onBackToPractice?: () => void;
  onToggleLanguage?: () => void;
  isModal?: boolean;
}

export const BookPageViewer: React.FC<BookPageViewerProps> = ({
  initialPage = 1,
  language,
  onClose,
  onBackToPractice,
  onToggleLanguage,
  isModal = false,
}) => {
  const isLt = language === 'lt';

  const [currentPage, setCurrentPage] = useState<number>(() =>
    Math.max(1, Math.min(TOTAL_BOOK_PAGES, Math.floor(initialPage) || 1))
  );
  const [inputVal, setInputVal] = useState<string>(String(currentPage));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLtBannerOpen, setIsLtBannerOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('chordair_book_lt_banner');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  });
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const pinchStartDistRef = useRef<number | null>(null);
  const initialZoomRef = useRef<number>(1);

  // Sync state if initialPage changes from outside
  useEffect(() => {
    if (initialPage && initialPage >= 1 && initialPage <= TOTAL_BOOK_PAGES) {
      setCurrentPage(initialPage);
      setInputVal(String(initialPage));
      setIsLoading(true);
      setLoadError(false);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [initialPage]);

  // Sync input value with current page
  useEffect(() => {
    setInputVal(String(currentPage));
  }, [currentPage]);

  // Pre-fetch adjacent pages (N - 1 and N + 1) invisibly for lightning-fast page flips
  useEffect(() => {
    const adjacent = [currentPage - 1, currentPage + 1].filter(
      (p) => p >= 1 && p <= TOTAL_BOOK_PAGES
    );
    adjacent.forEach((p) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = getPageImageUrl(p);
    });
  }, [currentPage]);

  const goToPage = useCallback(
    (page: number) => {
      const target = Math.max(1, Math.min(TOTAL_BOOK_PAGES, Math.floor(page)));
      if (target === currentPage) return;
      setCurrentPage(target);
      setIsLoading(true);
      setLoadError(false);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    },
    [currentPage]
  );

  const handlePrev = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const handleNext = useCallback(() => {
    if (currentPage < TOTAL_BOOK_PAGES) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage]);

  const handleJump = useCallback(
    (delta: number) => {
      goToPage(currentPage + delta);
    },
    [currentPage, goToPage]
  );

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number.parseInt(inputVal, 10);
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= TOTAL_BOOK_PAGES) {
      goToPage(parsed);
    } else {
      setInputVal(String(currentPage));
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => {
      const next = Math.min(3, Number((prev + 0.5).toFixed(1)));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(1, Number((prev - 0.5).toFixed(1)));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleToggleLtBanner = () => {
    setIsLtBannerOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('chordair_book_lt_banner', String(next));
      } catch {}
      return next;
    });
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen?.().catch(() => {
        // Fallback to CSS fullscreen
        setIsFullscreen((prev) => !prev);
      });
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    } else {
      setIsFullscreen((prev) => !prev);
    }
  };

  // Double tap / click to toggle zoom
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom > 1) {
      handleResetZoom();
    } else {
      setZoom(2);
      // Center zoom towards click position roughly
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left - rect.width / 2;
      const clickY = e.clientY - rect.top - rect.height / 2;
      setPan({ x: -clickX * 0.5, y: -clickY * 0.5 });
    }
  };

  // Mouse pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    // Bound panning to reasonable viewport range
    const maxOffset = 450 * (zoom - 1);
    const nextX = Math.max(-maxOffset, Math.min(maxOffset, dragStartRef.current.panX + dx));
    const nextY = Math.max(-maxOffset, Math.min(maxOffset, dragStartRef.current.panY + dy));
    setPan({ x: nextX, y: nextY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handling: Pinch to zoom + Pan + Horizontal swipe to turn page
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      pinchStartDistRef.current = dist;
      initialZoomRef.current = zoom;
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      if (zoom > 1) {
        setIsDragging(true);
        dragStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          panX: pan.x,
          panY: pan.y,
        };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      // Pinch zooming
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const ratio = dist / pinchStartDistRef.current;
      const nextZoom = Math.max(1, Math.min(3, Number((initialZoomRef.current * ratio).toFixed(2))));
      setZoom(nextZoom);
      if (nextZoom === 1) setPan({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && isDragging && zoom > 1) {
      // Panning
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.x;
      const dy = touch.clientY - dragStartRef.current.y;
      const maxOffset = 450 * (zoom - 1);
      const nextX = Math.max(-maxOffset, Math.min(maxOffset, dragStartRef.current.panX + dx));
      const nextY = Math.max(-maxOffset, Math.min(maxOffset, dragStartRef.current.panY + dy));
      setPan({ x: nextX, y: nextY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (pinchStartDistRef.current !== null) {
      pinchStartDistRef.current = null;
    }
    if (isDragging) {
      setIsDragging(false);
    }

    // Check for swipe gesture when not zoomed
    if (zoom === 1 && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const duration = Date.now() - touchStartRef.current.time;

      // Horizontal swipe detected (dx > 45px and mostly horizontal)
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5 && duration < 500) {
        if (dx < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        handleJump(-10);
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        handleJump(10);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToPage(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToPage(TOTAL_BOOK_PAGES);
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        handleResetZoom();
      } else if (e.key === 't' || e.key === 'T') {
        handleToggleLtBanner();
      } else if (e.key === 'Escape') {
        if (isDrawerOpen) {
          setIsDrawerOpen(false);
        } else if (zoom > 1) {
          handleResetZoom();
        } else if (onClose) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, handleJump, goToPage, zoom, isDrawerOpen, onClose]);

  const translationResult = getPageTranslation(currentPage);
  const { entry: pageTranslation, isExact } = translationResult;
  const currentLandmark = findLandmarkForPage(currentPage);
  const nearestLandmark = getNearestLandmark(currentPage);

  // Filtered landmarks for drawer
  const filteredLandmarks = BOOK_LANDMARKS.filter((lm) => {
    const matchesCategory = selectedCategory === 'all' || lm.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = (isLt ? lm.titleLt : lm.titleEn).toLowerCase();
    const lesson = lm.lesson.toLowerCase();
    const desc = (isLt ? lm.descLt || '' : lm.descEn || '').toLowerCase();
    return (
      title.includes(q) ||
      lesson.includes(q) ||
      desc.includes(q) ||
      String(lm.page).includes(q)
    );
  });

  return (
    <div
      ref={containerRef}
      className={`book-page-viewer ${isFullscreen ? 'book-page-viewer--fullscreen' : ''} ${
        isModal ? 'book-page-viewer--modal' : ''
      }`}
      role="region"
      aria-label={
        isLt
          ? 'Klavišinių vadovėlio natų peržiūra'
          : 'Keyboard Manual Sheet Music Viewer'
      }
    >
      {/* Top Action & Control Bar */}
      <header className="viewer-top-bar">
        <div className="viewer-brand-section">
          {onClose && (
            <button
              type="button"
              className="viewer-action-btn viewer-back-btn"
              onClick={onClose}
              title={isLt ? 'Uždaryti natų peržiūrą' : 'Close sheet music viewer'}
              aria-label={isLt ? 'Uždaryti' : 'Close'}
            >
              ← {isLt ? 'Uždaryti' : 'Close'}
            </button>
          )}

          {onBackToPractice && !onClose && (
            <button
              type="button"
              className="viewer-action-btn viewer-back-btn"
              onClick={onBackToPractice}
              title={isLt ? 'Grįžti į treniruotę' : 'Back to practice'}
            >
              ← {isLt ? 'Praktika' : 'Practice'}
            </button>
          )}

          <div className="viewer-title-group">
            <span className="viewer-badge">
              {isLt ? '216 Puslapių vadovėlis' : '216-Page Manual'}
            </span>
            <h2 className="viewer-main-heading">
              {isLt
                ? 'Progressive Learn to Play Keyboards'
                : 'Progressive Learn to Play Keyboards'}
            </h2>
          </div>
        </div>

        <div className="viewer-quick-controls">
          {/* Landmark Curriculum Drawer Trigger */}
          <button
            type="button"
            className="viewer-landmark-trigger-btn"
            onClick={() => setIsDrawerOpen(true)}
            aria-expanded={isDrawerOpen}
            aria-haspopup="dialog"
            title={
              isLt
                ? 'Atidaryti pamokų ir kūrinių rodyklę'
                : 'Open curriculum and repertoire index'
            }
          >
            📑{' '}
            <span className="landmark-trigger-text">
              {currentLandmark
                ? `${currentLandmark.lesson}: ${
                    isLt ? currentLandmark.titleLt : currentLandmark.titleEn
                  }`
                : nearestLandmark
                ? `${nearestLandmark.lesson} (${isLt ? nearestLandmark.titleLt : nearestLandmark.titleEn})`
                : isLt
                ? 'Pamokų rodyklė'
                : 'Curriculum Index'}
            </span>
            <span className="landmark-trigger-arrow">▾</span>
          </button>

          {/* Zoom Controls */}
          <div className="viewer-zoom-group" role="group" aria-label="Zoom controls">
            <button
              type="button"
              className="viewer-tool-btn"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              title={isLt ? 'Sumažinti (-)' : 'Zoom out (-)'}
              aria-label={isLt ? 'Sumažinti' : 'Zoom out'}
            >
              🔍−
            </button>
            <span className="viewer-zoom-label" title={isLt ? 'Dabartinis mastelis' : 'Current zoom'}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              className="viewer-tool-btn"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              title={isLt ? 'Padidinti (+)' : 'Zoom in (+)'}
              aria-label={isLt ? 'Padidinti' : 'Zoom in'}
            >
              🔍+
            </button>
            {zoom > 1 && (
              <button
                type="button"
                className="viewer-tool-btn viewer-tool-btn--reset"
                onClick={handleResetZoom}
                title={isLt ? 'Atkurti mastelį (0)' : 'Reset zoom (0)'}
                aria-label={isLt ? 'Atkurti 100%' : 'Reset 100%'}
              >
                ↺ 1x
              </button>
            )}
            <button
              type="button"
              className={`viewer-tool-btn ${isFullscreen ? 'viewer-tool-btn--active' : ''}`}
              onClick={handleToggleFullscreen}
              title={
                isFullscreen
                  ? isLt
                    ? 'Išeiti iš viso ekrano režimo'
                    : 'Exit fullscreen'
                  : isLt
                  ? 'Visas ekranas'
                  : 'Fullscreen'
              }
              aria-label={isLt ? 'Visas ekranas' : 'Fullscreen'}
            >
              {isFullscreen ? '✕' : '⛶'}
            </button>
          </div>

          {onToggleLanguage && (
            <button
              type="button"
              className="icon-btn lang-toggle-btn viewer-lang-btn"
              onClick={onToggleLanguage}
              aria-label={isLt ? 'Switch to English' : 'Perjungti į lietuvių kalbą'}
            >
              <span className={!isLt ? 'lang-code--active' : 'lang-code--inactive'}>EN</span>
              <span className="lang-divider" aria-hidden="true">
                /
              </span>
              <span className={isLt ? 'lang-code--active' : 'lang-code--inactive'}>LT</span>
            </button>
          )}
        </div>
      </header>

      {/* Collapsible Lithuanian Instructional Banner directly above the score */}
      <section
        className={`viewer-lt-banner ${
          isLtBannerOpen ? 'viewer-lt-banner--open' : 'viewer-lt-banner--collapsed'
        }`}
        aria-label="Lietuviškas vadovas ir paaiškinimai"
      >
        <div
          className="lt-banner-header"
          onClick={handleToggleLtBanner}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggleLtBanner();
            }
          }}
          title={isLtBannerOpen ? 'Spustelėkite, norėdami suskleisti (T)' : 'Spustelėkite, norėdami išskleisti (T)'}
        >
          <div className="lt-banner-left">
            <span className="lt-flag-badge" aria-hidden="true">🇱🇹 LT</span>
            <span className="lt-lesson-tag">{pageTranslation.lessonTag}</span>
            <span className="lt-page-pill">p. {pageTranslation.page}</span>
            <span className="lt-banner-headline">{pageTranslation.titleLt}</span>
            {!isExact && (
              <span className="lt-derived-badge" title="Praktikos tęsinys iš ankstesnės temos">
                Tęsinys
              </span>
            )}
          </div>

          <div className="lt-banner-actions" onClick={(e) => e.stopPropagation()}>
            {pageTranslation.audioPreview && (
              <button
                type="button"
                className="lt-audio-btn"
                onClick={() => {
                  const midis = pageTranslation.audioPreview?.midis || [];
                  if (midis.length === 1) {
                    playNote(midis[0]);
                  } else {
                    midis.forEach((m, idx) => {
                      playNote(m, idx * 0.28, 0.9, 0.7);
                    });
                  }
                }}
                title={`Klausyti garso pavyzdžio: ${pageTranslation.audioPreview.labelLt}`}
              >
                🔊 <span className="lt-audio-label">{pageTranslation.audioPreview.labelLt}</span>
              </button>
            )}

            <button
              type="button"
              className="lt-toggle-btn"
              onClick={handleToggleLtBanner}
              aria-expanded={isLtBannerOpen}
              aria-label={isLtBannerOpen ? 'Suskleisti vadovo skiltį' : 'Išskleisti vadovo skiltį'}
            >
              <span>{isLtBannerOpen ? 'Slėpti vadovą ▲' : 'Rodyti paaiškinimą ▼'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Body */}
        {isLtBannerOpen && (
          <div className="lt-banner-body">
            <p className="lt-banner-summary">{pageTranslation.summaryLt}</p>

            <div className="lt-banner-grid">
              <div className="lt-banner-col">
                <h4 className="lt-col-title">👉 Kaip atlikti ir groti:</h4>
                <ul className="lt-list">
                  {pageTranslation.instructionsLt.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>

              {pageTranslation.theoryNotesLt && pageTranslation.theoryNotesLt.length > 0 && (
                <div className="lt-banner-col">
                  <h4 className="lt-col-title">🎼 Natų raštas ir teorija:</h4>
                  <ul className="lt-list">
                    {pageTranslation.theoryNotesLt.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {pageTranslation.tipLt && (
              <div className="lt-banner-tip">
                <span className="tip-icon" aria-hidden="true">💡</span>
                <span>
                  <strong>Mokytojo patarimas:</strong> {pageTranslation.tipLt}
                </span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Main Sheet Music Canvas Area */}
      <main
        className="viewer-stage"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
        style={{
          cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        {/* Subtle navigation overlay hotspots for quick tap/click on sides */}
        {zoom === 1 && (
          <>
            <button
              type="button"
              className="stage-edge-nav stage-edge-nav--left"
              onClick={handlePrev}
              disabled={currentPage <= 1}
              aria-label={isLt ? 'Ankstesnis puslapis' : 'Previous page'}
              title={isLt ? 'Ankstesnis puslapis (←)' : 'Previous page (←)'}
            >
              <span className="edge-nav-chevron">‹</span>
            </button>
            <button
              type="button"
              className="stage-edge-nav stage-edge-nav--right"
              onClick={handleNext}
              disabled={currentPage >= TOTAL_BOOK_PAGES}
              aria-label={isLt ? 'Kitas puslapis' : 'Next page'}
              title={isLt ? 'Kitas puslapis (→)' : 'Next page (→)'}
            >
              <span className="edge-nav-chevron">›</span>
            </button>
          </>
        )}

        <div
          className="viewer-image-wrapper"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.18s cubic-bezier(0.2, 0, 0, 1)',
          }}
        >
          {/* Skeleton loading animation */}
          {isLoading && (
            <div className="viewer-skeleton" aria-hidden="true">
              <div className="skeleton-spinner" />
              <div className="skeleton-text">
                {isLt
                  ? `Kraunamas ${currentPage} puslapis...`
                  : `Loading page ${currentPage}...`}
              </div>
            </div>
          )}

          {/* Error fallback state */}
          {loadError ? (
            <div className="viewer-error-state">
              <span className="error-icon">⚠️</span>
              <p>
                {isLt
                  ? `Nepavyko įkelti ${currentPage} puslapio natų.`
                  : `Failed to load page ${currentPage}.`}
              </p>
              <button
                type="button"
                className="guide-audio-btn"
                onClick={() => {
                  setLoadError(false);
                  setIsLoading(true);
                }}
              >
                {isLt ? 'Bandyti dar kartą' : 'Retry'}
              </button>
            </div>
          ) : (
            <img
              key={`page-${currentPage}`}
              src={getPageImageUrl(currentPage)}
              alt={
                isLt
                  ? `Vadovėlio ${currentPage} puslapis iš ${TOTAL_BOOK_PAGES}`
                  : `Keyboard Manual Page ${currentPage} of ${TOTAL_BOOK_PAGES}`
              }
              className={`viewer-page-img ${isLoading ? 'viewer-page-img--hidden' : ''}`}
              loading="lazy"
              decoding="async"
              draggable={false}
              onLoad={() => {
                setIsLoading(false);
                setLoadError(false);
              }}
              onError={() => {
                setIsLoading(false);
                setLoadError(true);
              }}
            />
          )}
        </div>
      </main>

      {/* Bottom Navigation Toolbar */}
      <footer className="viewer-bottom-bar">
        {/* Navigation buttons */}
        <div className="viewer-nav-actions">
          <button
            type="button"
            className="viewer-nav-btn"
            onClick={() => goToPage(1)}
            disabled={currentPage <= 1}
            title={isLt ? 'Pirmas puslapis (Home)' : 'First page (Home)'}
            aria-label={isLt ? 'Pirmas puslapis' : 'First page'}
          >
            « 1
          </button>
          <button
            type="button"
            className="viewer-nav-btn"
            onClick={() => handleJump(-10)}
            disabled={currentPage <= 1}
            title={isLt ? '10 puslapių atgal (PgUp)' : '10 pages back (PgUp)'}
            aria-label={isLt ? '10 puslapių atgal' : '10 pages back'}
          >
            -10
          </button>
          <button
            type="button"
            className="viewer-nav-btn viewer-nav-btn--primary"
            onClick={handlePrev}
            disabled={currentPage <= 1}
            title={isLt ? 'Ankstesnis puslapis (←)' : 'Previous page (←)'}
            aria-label={isLt ? 'Ankstesnis puslapis' : 'Previous page'}
          >
            ‹ {isLt ? 'Atgal' : 'Prev'}
          </button>

          {/* Direct Page Input Form */}
          <form onSubmit={handleInputSubmit} className="viewer-page-form">
            <span className="page-label">{isLt ? 'Psl.' : 'Page'}</span>
            <input
              type="number"
              min={1}
              max={TOTAL_BOOK_PAGES}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onBlur={() => {
                const parsed = Number.parseInt(inputVal, 10);
                if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= TOTAL_BOOK_PAGES) {
                  goToPage(parsed);
                } else {
                  setInputVal(String(currentPage));
                }
              }}
              className="viewer-page-input"
              aria-label={isLt ? 'Puslapio numeris' : 'Page number'}
            />
            <span className="page-total">/ {TOTAL_BOOK_PAGES}</span>
          </form>

          <button
            type="button"
            className="viewer-nav-btn viewer-nav-btn--primary"
            onClick={handleNext}
            disabled={currentPage >= TOTAL_BOOK_PAGES}
            title={isLt ? 'Kitas puslapis (→)' : 'Next page (→)'}
            aria-label={isLt ? 'Kitas puslapis' : 'Next page'}
          >
            {isLt ? 'Pirmyn' : 'Next'} ›
          </button>
          <button
            type="button"
            className="viewer-nav-btn"
            onClick={() => handleJump(10)}
            disabled={currentPage >= TOTAL_BOOK_PAGES}
            title={isLt ? '10 puslapių į priekį (PgDn)' : '10 pages forward (PgDn)'}
            aria-label={isLt ? '10 puslapių į priekį' : '10 pages forward'}
          >
            +10
          </button>
          <button
            type="button"
            className="viewer-nav-btn"
            onClick={() => goToPage(TOTAL_BOOK_PAGES)}
            disabled={currentPage >= TOTAL_BOOK_PAGES}
            title={isLt ? 'Paskutinis puslapis (End)' : 'Last page (End)'}
            aria-label={isLt ? 'Paskutinis puslapis' : 'Last page'}
          >
            216 »
          </button>
        </div>

        {/* Scrub Slider for fast smooth scanning across all 216 pages */}
        <div className="viewer-slider-container">
          <input
            type="range"
            min={1}
            max={TOTAL_BOOK_PAGES}
            value={currentPage}
            onChange={(e) => goToPage(Number(e.target.value))}
            className="viewer-slider"
            aria-label={isLt ? 'Puslapių slankiklis' : 'Book page scrub slider'}
          />
        </div>
      </footer>

      {/* Curriculum & Repertoire Drawer Modal */}
      {isDrawerOpen && (
        <div
          className="viewer-drawer-backdrop"
          onClick={() => setIsDrawerOpen(false)}
          role="presentation"
        >
          <aside
            className="viewer-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            <div className="viewer-drawer-header">
              <div>
                <h3 id="drawer-title" className="drawer-title">
                  📑 {isLt ? 'Vadovėlio pamokų ir kūrinių rodyklė' : 'Book Curriculum & Repertoire'}
                </h3>
                <p className="drawer-subtitle">
                  {isLt
                    ? 'Greitai pereikite prie 46 pamokų, kūrinių ir gamų'
                    : 'Jump directly to any landmark lesson, scale, or song piece'}
                </p>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsDrawerOpen(false)}
                aria-label={isLt ? 'Uždaryti' : 'Close'}
              >
                ✕
              </button>
            </div>

            {/* Filter Pills & Search */}
            <div className="drawer-search-row">
              <input
                type="search"
                className="drawer-search-input"
                placeholder={
                  isLt
                    ? 'Ieškoti kūrinio ar pamokos (pvz. Ode to Joy, Blues, Scale)...'
                    : 'Search song or lesson (e.g. Ode to Joy, Blues, Scale)...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="drawer-category-pills">
              {[
                { id: 'all', en: 'All Landmarks', lt: 'Visi orientyrai' },
                { id: 'basics', en: 'Basics & Posture', lt: 'Pagrindai' },
                { id: 'repertoire', en: 'Repertoire Pieces', lt: 'Kūriniai' },
                { id: 'scales', en: 'Scales & Keys', lt: 'Gamos ir tonacijos' },
                { id: 'blues', en: 'Blues & Boogie', lt: 'Bliuzas' },
                { id: 'advanced', en: 'Modes & Chords', lt: 'Dermės ir akordai' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`drawer-cat-pill ${
                    selectedCategory === cat.id ? 'drawer-cat-pill--active' : ''
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {isLt ? cat.lt : cat.en}
                </button>
              ))}
            </div>

            {/* Landmarks List */}
            <div className="drawer-landmarks-list" role="list">
              {filteredLandmarks.map((lm: BookLandmark) => {
                const isSelected = lm.page === currentPage;
                return (
                  <button
                    key={`${lm.page}-${lm.lesson}`}
                    type="button"
                    className={`drawer-landmark-card ${
                      isSelected ? 'drawer-landmark-card--active' : ''
                    }`}
                    onClick={() => {
                      goToPage(lm.page);
                      setIsDrawerOpen(false);
                    }}
                    role="listitem"
                  >
                    <div className="landmark-page-badge">p. {lm.page}</div>
                    <div className="landmark-info">
                      <div className="landmark-lesson-tag">{lm.lesson}</div>
                      <div className="landmark-title">
                        {isLt ? lm.titleLt : lm.titleEn}
                      </div>
                      {(lm.descLt || lm.descEn) && (
                        <div className="landmark-desc">
                          {isLt ? lm.descLt : lm.descEn}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

              {filteredLandmarks.length === 0 && (
                <div className="drawer-empty-state">
                  {isLt
                    ? 'Pagal jūsų paiešką rezultatų nerasta.'
                    : 'No matching curriculum landmarks found.'}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
