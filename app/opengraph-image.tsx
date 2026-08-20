import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#050510',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Purple glow top-left */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)',
          }}
        />
        {/* Blue glow bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -100,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.28) 0%, transparent 70%)',
          }}
        />
        {/* Cyan glow center */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Logo badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 72,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
            marginBottom: 28,
            boxShadow: '0 0 40px rgba(124,58,237,0.5)',
          }}
        >
          <span style={{ color: 'white', fontSize: 28, fontWeight: 800 }}>SS</span>
        </div>

        {/* Company name */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-2px',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          Shah{' '}
          <span style={{ color: '#9F67FF' }}>Solutions</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 26,
            color: '#94A3B8',
            marginBottom: 40,
            textAlign: 'center',
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Premium IT Services — SEO · GEO · Web Dev · App Dev
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 12 }}>
          {['Pakistan\'s Premier IT Agency', 'Serving Worldwide', '150+ Projects Delivered'].map((label) => (
            <div
              key={label}
              style={{
                padding: '10px 22px',
                borderRadius: 50,
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.35)',
                color: '#C4B5FD',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            color: '#475569',
            fontSize: 14,
          }}
        >
          shahsolutions.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
