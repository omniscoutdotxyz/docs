import { getPageImageUrl, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const revalidate = false;

const accent = '#5cc2bc';
const accentDeep = '#0f766e';
const background = '#04100e';

// The logo file is a padded 1024x1024 canvas, so crop the viewBox to the mark's
// bounds to keep it from rendering tiny inside the badge.
const markViewBox = '184 124 710 778';

async function getLogo() {
  const svg = await readFile(join(process.cwd(), 'public/omniscout.svg'), 'utf8');

  return `data:image/svg+xml;base64,${Buffer.from(
    svg.replace('viewBox="0 0 1024 1024"', `viewBox="${markViewBox}"`),
  ).toString('base64')}`;
}

function OgCard({
  title,
  description,
  logo,
}: {
  title: string;
  description?: string;
  logo: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: '64px 72px 72px',
        backgroundColor: background,
        backgroundImage: `radial-gradient(circle at 88% -15%, rgba(92,194,188,0.28), rgba(92,194,188,0) 55%), radial-gradient(circle at -5% 115%, rgba(15,118,110,0.45), rgba(15,118,110,0) 55%)`,
        color: '#f5f7f7',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: 'rgba(92,194,188,0.12)',
            border: '1px solid rgba(92,194,188,0.35)',
          }}
        >
          <img src={logo} alt="" width={32} height={36} style={{ objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
          <span style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.01em' }}>
            OmniScout
          </span>
          <span style={{ fontSize: '26px', color: 'rgba(245,247,247,0.5)' }}>Docs</span>
        </div>
        <span
          style={{
            display: 'flex',
            marginLeft: 'auto',
            fontSize: '22px',
            color: 'rgba(92,194,188,0.8)',
          }}
        >
          docs.omniscout.xyz
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 'auto',
          marginBottom: 'auto',
          paddingTop: '48px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{ width: '28px', height: '3px', borderRadius: '2px', backgroundColor: accent }}
          />
          <span
            style={{
              fontSize: '20px',
              fontWeight: 600,
              letterSpacing: '0.24em',
              color: accent,
            }}
          >
            DOCUMENTATION
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: title.length > 40 ? '68px' : '78px',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            marginTop: '26px',
            lineClamp: 2,
          }}
        >
          {title}
        </div>

        {description ? (
          <div
            style={{
              display: 'flex',
              fontSize: '30px',
              lineHeight: 1.4,
              color: 'rgba(226,236,235,0.62)',
              marginTop: '22px',
              lineClamp: 2,
            }}
          >
            {description}
          </div>
        ) : null}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '8px',
          display: 'flex',
          backgroundImage: `linear-gradient(90deg, ${accentDeep}, ${accent} 45%, rgba(92,194,188,0.15))`,
        }}
      />
    </div>
  );
}

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <OgCard
      title={page.data.title}
      description={page.data.description}
      logo={await getLogo()}
    />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImageUrl(page).segments,
  }));
}
