/**
 * GlassBackground - Geometric mountain lake gradient background
 * Used as the full-page background for all glass UI pages
 */
export function GlassBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sharp Geometric Background with Mountain Lake Colors */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          background: `
            linear-gradient(163deg,
              var(--glass-bg-1) 0%,
              var(--glass-bg-1) 15%,
              var(--glass-bg-2) 15%,
              var(--glass-bg-2) 28%,
              var(--glass-bg-3) 28%,
              var(--glass-bg-3) 42%,
              var(--glass-bg-4) 42%,
              var(--glass-bg-4) 58%,
              var(--glass-bg-5) 58%,
              var(--glass-bg-5) 72%,
              var(--glass-bg-6) 72%,
              var(--glass-bg-6) 85%,
              var(--glass-bg-7) 85%,
              var(--glass-bg-7) 100%
            )
          `,
        }}
      />

      {/* Accent geometric shapes */}
      <div className="fixed inset-0 -z-10">
        {/* Dark mountain shape */}
        <div
          className="absolute bottom-0 left-0 w-[40%] h-[35%]"
          style={{
            background: 'linear-gradient(145deg, #1a4d5e 0%, #0d2838 100%)',
            clipPath: 'polygon(0 100%, 0 40%, 100% 100%)',
          }}
        />

        {/* Light accent diamond */}
        <div
          className="absolute top-[10%] right-[5%] w-[25%] h-[25%] backdrop-blur-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }}
        />
      </div>

      {/* Overlay gradient for better readability */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative min-h-screen p-[clamp(20px,5vw,32px)] px-[clamp(12px,4vw,16px)] flex justify-center items-start">
        <div className="max-w-[640px] w-full">{children}</div>
      </div>
    </div>
  );
}
