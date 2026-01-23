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
      {/* Fixed Background - extends into safe areas (notch/status bar) */}
      <div
        className="fixed -z-20"
        style={{
          top: 'calc(-1 * env(safe-area-inset-top, 0px))',
          right: 'calc(-1 * env(safe-area-inset-right, 0px))',
          bottom: 'calc(-1 * env(safe-area-inset-bottom, 0px))',
          left: 'calc(-1 * env(safe-area-inset-left, 0px))',
          width: 'calc(100vw + env(safe-area-inset-left, 0px) + env(safe-area-inset-right, 0px))',
          height: 'calc(100svh + env(safe-area-inset-top, 0px) + env(safe-area-inset-bottom, 0px))',
          WebkitTransform: 'translate3d(0, 0, 0)',
          transform: 'translate3d(0, 0, 0)',
        }}
      >
        <picture className="block w-full h-full">
          <source srcSet={backgroundAvif} type="image/avif" />
          <source srcSet={backgroundWebp} type="image/webp" />
          <img
            src={backgroundWebp}
            alt=""
            className="block w-full h-full object-cover"
          />
        </picture>
      </div>

      {/* Fixed Overlay - extends into safe areas */}
      <div
        className="fixed -z-10 pointer-events-none"
        style={{
          top: 'calc(-1 * env(safe-area-inset-top, 0px))',
          right: 'calc(-1 * env(safe-area-inset-right, 0px))',
          bottom: 'calc(-1 * env(safe-area-inset-bottom, 0px))',
          left: 'calc(-1 * env(safe-area-inset-left, 0px))',
          width: 'calc(100vw + env(safe-area-inset-left, 0px) + env(safe-area-inset-right, 0px))',
          height: 'calc(100svh + env(safe-area-inset-top, 0px) + env(safe-area-inset-bottom, 0px))',
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
