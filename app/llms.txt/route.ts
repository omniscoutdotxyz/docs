import { getLLMText, source } from '@/lib/source';

export const revalidate = false;

const INSTALLATION_SLUG = 'installation';
const BASE_URL = 'https://docs.omniscout.xyz';

type Page = (typeof source)['$inferPage'];

/**
 * Processed markdown replaces local images with `__img0`, `__img1` placeholders.
 * Swap them back for absolute URLs so the file is readable outside the site.
 */
async function withImageUrls(page: Page) {
  const [text, raw] = await Promise.all([getLLMText(page), page.data.getText('raw')]);
  const urls = Array.from(raw.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g), (match) => match[1]);

  return text.replace(/__img(\d+)/g, (placeholder, index) => {
    const url = urls[Number(index)];
    if (!url) return placeholder;

    return url.startsWith('/') ? `${BASE_URL}${url}` : url;
  });
}

export async function GET() {
  const page = source
    .getPages()
    .find((item) => item.locale === 'en' && item.slugs.join('/') === INSTALLATION_SLUG);

  if (!page) {
    return new Response('# Installation\n\nPage not found.', { status: 404 });
  }

  return new Response(await withImageUrls(page), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
