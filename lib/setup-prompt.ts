/**
 * Setup prompt shown on omniscout.xyz, for agents that cannot use the
 * "Copy Prompt" button. Keep in sync with SETUP_PROMPT in
 * website/src/app/components/SetupAgents.tsx.
 */
export const SETUP_PROMPT = `# OmniScout setup

Set up the latest OmniScout release on this machine. Run the commands yourself.
Only pause when the user needs to approve an operating-system or browser
permission.

1. Check that Python 3.11 or newer is available. Install or upgrade OmniScout
   to the latest release:

   \`\`\`bash
   python3 -m pip install --upgrade omniscout
   \`\`\`

   If OmniScout is already installed another way, use that same installer to
   upgrade it.

2. List installed browsers and select the current browser if it is installed;
   otherwise select the first installed Chromium browser:

   \`\`\`bash
   omniscout --json settings browsers
   \`\`\`

   If no supported browser is installed, tell the user which browser to install
   and stop here. Do not guess a browser ID.

3. Install the agent skill, the default embedding model, and Probe Zero Mini.
   Probe Zero Mini is a one-time download of about 700 MB.

   \`\`\`bash
   omniscout install --browser <browser-id> --skill --probe-0-mini
   \`\`\`

4. Set up the selected browser:

   \`\`\`bash
   omniscout setup --browser <browser-id>
   \`\`\`

   Setup saves the default browser, prepares the extension, opens the extension
   and remote-debugging pages, and starts the operating system's Accessibility
   flow. On macOS, the OS may show an Accessibility prompt. On Windows and
   Linux, OmniScout opens Accessibility settings when available; an app-specific
   consent popup may not exist. The browser's remote-debugging page asks to
   allow debugging for this browser instance.

5. Ask the user to review the OS prompt or settings and grant Accessibility
   access to the app running OmniScout. Ask them to click **Allow** on the
   browser's remote-debugging prompt. Never click these consent controls or
   change permissions for the user. If no popup appears, leave the relevant
   settings page open and explain which setting they need to enable.

6. If OmniScout did not load the extension automatically, guide the user to
   choose **Load unpacked** on the extensions page and select the folder printed
   by setup. Wait for the user to confirm the permissions and extension
   connection before reporting that setup is complete.

7. Verify the installation:

   \`\`\`bash
   omniscout --version
   omniscout settings show
   omniscout daemon start
   omniscout daemon status
   \`\`\`

Report any missing model, browser, permission, or extension connection clearly.`;
