import backgroundAvif from '../../assets/background.avif?url';
import backgroundWebp from '../../assets/background.webp?url';

/**
 * GlassBackground - Full-page background with iOS Safari scroll fix
 *
 * Architecture: Body is locked (no scroll). Background is position:fixed.
 * Content scrolls inside a fixed scroll container. This prevents iOS Safari
 * from repainting the background during scroll.
 */
export function GlassBackground({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Fixed Background - completely outside scroll flow */}
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

      {/* Fixed Overlay - also outside scroll flow */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Scroll Container - this is what actually scrolls */}
      <div
        className="fixed inset-0 overflow-auto"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          className="flex justify-center items-start min-h-full"
          style={{ padding: 'clamp(20px, 5vw, 32px) clamp(12px, 4vw, 16px)' }}
        >
          <div className="max-w-[512px] w-full">{children}</div>
        </div>
      </div>
    </>
  );
}
