import backgroundAvif from '../../assets/background.avif?url';
import backgroundWebp from '../../assets/background.webp?url';

/**
 * GlassBackground - Full-page background with image
 * Uses AVIF with WebP fallback, Vite-optimized with content hashing for caching
 *
 * iOS Safari fix: Uses inset-0 WITHOUT height units on fixed elements.
 * Mixing inset-0 with viewport height units causes background jumping on scroll.
 */
export function GlassBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Fixed Background Container - iOS Safari optimized */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          WebkitTransform: 'translate3d(0, 0, 0)',
          transform: 'translate3d(0, 0, 0)',
        }}
      >
        <picture className="block absolute inset-0">
          <source srcSet={backgroundAvif} type="image/avif" />
          <source srcSet={backgroundWebp} type="image/webp" />
          <img
            src={backgroundWebp}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>
      </div>

      {/* Overlay gradient for better readability */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Content */}
      <div
        className="relative flex justify-center items-start min-h-screen"
        style={{ padding: 'clamp(20px, 5vw, 32px) clamp(12px, 4vw, 16px)' }}
      >
        <div className="max-w-[512px] w-full">{children}</div>
      </div>
    </div>
  );
}
