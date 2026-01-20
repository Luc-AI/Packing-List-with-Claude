import backgroundAvif from '../../assets/background.avif?url';
import backgroundWebp from '../../assets/background.webp?url';

/**
 * GlassBackground - Full-page background with image
 * Uses AVIF with WebP fallback, Vite-optimized with content hashing for caching
 */
export function GlassBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with AVIF/WebP fallback */}
      <picture className="fixed inset-0 -z-20">
        <source srcSet={backgroundAvif} type="image/avif" />
        <source srcSet={backgroundWebp} type="image/webp" />
        <img
          src={backgroundWebp}
          alt=""
          className="w-full h-full object-cover"
        />
      </picture>

      {/* Overlay gradient for better readability */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative min-h-screen p-[clamp(20px,5vw,32px)] px-[clamp(12px,4vw,16px)] flex justify-center items-start">
        <div className="max-w-[512px] w-full">{children}</div>
      </div>
    </div>
  );
}
