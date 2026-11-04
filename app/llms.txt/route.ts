import { SETUP_PROMPT } from '@/lib/setup-prompt';

export const revalidate = false;

const SITE_URL = 'https://docs.omniscout.xyz';
const DOCS_URL = 'https://docs.omniscout.xyz/en/docs/installation';
const WEBSITE_URL = 'https://omniscout.xyz/';
const VIDEO_URL = 'https://www.youtube.com/watch?v=tMrjALacGjQ';
const GITHUB_URL = 'https://github.com/sriramramnath/omniscout';
const EMAIL = 'sriramramnath2011@gmail.com';

const steps = [
  `Visit [omniscout.xyz](${WEBSITE_URL}) and click **Copy Prompt**, or select your AI agent to open the prompt in it.`,
  'Send the prompt to your agent. It installs OmniScout, picks a Chromium browser, installs the agent skill, and sets up the browser extension.',
  'Approve any operating-system or browser permission the agent asks you to review: browser selection, the Accessibility prompt, and **Allow Remote Debugging** on the browser page that opens.',
  'When setup finishes, a page opens automatically. Click **Allow Remote Debugging** there to turn on browser control.',
];

function buildLlmsTxt() {
  return `# OmniScout

> OmniScout is a local-first CLI that gives AI agents real-time web access: semantic search, browser automation, and computer control. Everything runs on your own machine.

Installation is the only manual step. After it, your AI agent finishes the rest of the setup. OmniScout runs on macOS, Linux, and Windows, needs Python 3.11 or newer, and drives a Chromium-based browser you already have installed.

## Installation

- [Installation guide](${DOCS_URL}): Video walkthrough and step-by-step screenshots for setting up OmniScout with an AI agent.
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

## Links

- [Documentation](${SITE_URL}/en): Full OmniScout documentation.
- [Website](${WEBSITE_URL}): Product overview and download page.
- [GitHub](${GITHUB_URL}): Source code and release notes.

## Contact

- Email: ${EMAIL}
- Issues: [GitHub Issues](${GITHUB_URL}/issues)
`;
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
