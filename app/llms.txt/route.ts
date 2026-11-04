import { source } from '@/lib/source';
import { languageCodes, languageLabels } from '@/lib/i18n';
import { SETUP_PROMPT } from '@/lib/setup-prompt';

export const revalidate = false;

const SITE_URL = 'https://docs.omniscout.xyz';
const DOCS_URL = 'https://docs.omniscout.xyz/en/docs/installation';
const WEBSITE_URL = 'https://omniscout.xyz/';
const VIDEO_URL = 'https://www.youtube.com/watch?v=tMrjALacGjQ';
const EMAIL = 'sriramramnath2011@gmail.com';

const steps = [
  `Visit [omniscout.xyz](${WEBSITE_URL}) and click **Copy Prompt**, or select your AI agent to open the prompt in it.`,
  'Send the prompt to your agent. It installs OmniScout, picks a Chromium browser, installs the agent skill, and sets up the browser extension.',
  'Approve any operating-system or browser permission the agent asks you to review: browser selection, the Accessibility prompt, and **Allow Remote Debugging** on the browser page that opens.',
  'When setup finishes, a page opens automatically. Click **Allow Remote Debugging** there to turn on browser control.',
];

type TreeNode = ReturnType<typeof source.getPageTree>['children'][number];

function link(page: { url: string; title: string; description?: string }) {
  const description = page.description?.trim();
  return description
    ? `- [${page.title}](${SITE_URL}${page.url}.md): ${description}`
    : `- [${page.title}](${SITE_URL}${page.url}.md)`;
}

function renderNode(node: TreeNode, lang: string, depth = 0): string[] {
  if (node.type === 'separator') return [];

  if (node.type === 'page') {
    const page = source.getNodePage(node, lang);
    // The docs root only redirects to the installation page.
    if (!page || page.url.endsWith('/docs')) return [];
    const item = link({
      url: page.url,
      title: page.data.title ?? String(node.name ?? ''),
      description: page.data.description,
    });
    return [depth > 0 ? `${'  '.repeat(depth)}${item}` : item];
  }

  const meta = source.getNodeMeta(node, lang);
  const title = meta?.data.title ?? (typeof node.name === 'string' ? node.name : undefined);
  const out: string[] = title ? [`${'  '.repeat(depth)}- ${title}`] : [];
  if (node.index) out.push(...renderNode(node.index, lang, depth + 1));
  for (const child of node.children) out.push(...renderNode(child, lang, depth + 1));
  return out;
}

function pageList(lang: string) {
  return source
    .getPageTree(lang)
    .children.flatMap((node) => renderNode(node, lang))
    .join('\n');
}

function buildLlmsTxt() {
  const otherLanguages = languageCodes
    .filter((lang) => lang !== 'en')
    .map(
      (lang) =>
        `- [${languageLabels[lang]}](${SITE_URL}/${lang}/docs/installation.md): The same documentation in ${languageLabels[lang]}.`,
    )
    .join('\n');

  return `# OmniScout

> OmniScout is a local-first CLI that gives AI agents real-time web access: semantic search, browser automation, and computer control. Everything runs on your own machine.

Installation is the only manual step. After it, your AI agent finishes the rest of the setup. OmniScout runs on macOS, Linux, and Windows, needs Python 3.11 or newer, and drives a Chromium-based browser you already have installed.

Every documentation page has a markdown version: append \`.md\` to the page URL, or send \`Accept: text/markdown\`. Use the markdown versions when you need the content of a page.

## Installation

- [Installation guide](${DOCS_URL}.md): Video walkthrough and step-by-step screenshots for setting up OmniScout with an AI agent.
- [Download OmniScout](${WEBSITE_URL}): Copy the setup prompt or open it directly in Claude Code, Cursor, Codex, or another agent.

### Before you start

- Python 3.11 or newer.
- A Chromium-based browser: Chrome, Edge, Brave, Arc, Dia, or Chromium.
- Any AI agent that can run terminal commands.

### Steps

${steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

### Video walkthrough

- [Watch the installation video](${VIDEO_URL}): The same steps shown on screen. If you watch the video, you do not need the written steps.

### Screenshots

- [The OmniScout website with the Copy Prompt button](${SITE_URL}/installation-guide/step-1.png)
- [AI agent choices on the OmniScout website](${SITE_URL}/installation-guide/step-2.png)
- [The OmniScout browser setup page](${SITE_URL}/installation-guide/step-3.png)

## Setup prompt

The **Copy Prompt** button copies this prompt. Paste it into your agent to run the setup yourself, or ask the user to paste it if you cannot open a browser.

\`\`\`\`text
${SETUP_PROMPT}
\`\`\`\`

## Documentation — English

${pageList('en')}

## Documentation — other languages

${otherLanguages}

## Full text

- [llms-full.txt](${SITE_URL}/llms-full.txt): Every documentation page in one file, for clients that cannot follow links.

## Links

- [Documentation](${SITE_URL}/en): Full OmniScout documentation.
- [Website](${WEBSITE_URL}): Product overview and download page.

## Contact

- Email: ${EMAIL}
`;
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
