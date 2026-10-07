---
name: playwright-cli
description: Automate browser interactions, test web pages, capture screenshots and snapshots, inspect DOM elements, and work with Playwright tests via CLI.
allowed-tools: Bash(playwright-cli:*) Bash(npx playwright:*) Bash(npx --no-install playwright:*)
---

# Browser Automation with playwright-cli

Use this skill to automate browser interactions, verify live frontend UI, test web applications, and inspect elements.

## Quick Start

```bash
# open new browser session
playwright-cli open
# navigate to target URL
playwright-cli goto http://localhost:5173
# interact with the page using element references from the snapshot
playwright-cli click e15
playwright-cli type "search query"
playwright-cli press Enter
# capture page snapshot / screenshot
playwright-cli snapshot
playwright-cli screenshot --filename=test.png
# close the browser
playwright-cli close
```

## Core Commands

```bash
# Navigation
playwright-cli open https://example.com/
playwright-cli goto https://example.com/
playwright-cli go-back
playwright-cli go-forward
playwright-cli reload

# Interactions
playwright-cli click e3
playwright-cli dblclick e7
playwright-cli fill e5 "user@example.com" --submit
playwright-cli type "search query"
playwright-cli hover e4
playwright-cli select e9 "option-value"
playwright-cli check e12
playwright-cli uncheck e12
playwright-cli upload ./document.pdf
playwright-cli drag e2 e8
playwright-cli drop e4 --path=./image.png

# DOM & Snapshot Inspection
playwright-cli snapshot
playwright-cli find "Sign in"
playwright-cli find --regex "/sign (in|up)/i"
playwright-cli eval "document.title"
playwright-cli eval "el => el.textContent" e5
playwright-cli eval "el => el.getAttribute('data-testid')" e5

# Dialogs & Window Size
playwright-cli dialog-accept
playwright-cli dialog-dismiss
playwright-cli resize 1920 1080
playwright-cli close
```

## Keyboard & Mouse

```bash
playwright-cli press Enter
playwright-cli press ArrowDown
playwright-cli keydown Shift
playwright-cli keyup Shift
playwright-cli mousemove 150 300
playwright-cli mousedown
playwright-cli mouseup
playwright-cli mousewheel 0 100
```

## Screenshots & Visual Proof

```bash
playwright-cli screenshot
playwright-cli screenshot e5
playwright-cli screenshot --filename=page.png --hires
playwright-cli pdf --filename=page.pdf
```

## Tab & State Management

```bash
playwright-cli tab-list
playwright-cli tab-new https://example.com
playwright-cli tab-close
playwright-cli tab-select 0

# Auth state & Cookies
playwright-cli state-save auth.json
playwright-cli state-load auth.json
playwright-cli cookie-list
playwright-cli cookie-set session_id abc123
playwright-cli localstorage-get theme
playwright-cli localstorage-set theme dark
```

## Device & Accessibility Emulation

```bash
playwright-cli set-color-scheme dark
playwright-cli set-reduced-motion reduce
playwright-cli set-contrast more
playwright-cli set-media print
```

## Network Mocking & Tracing

```bash
playwright-cli route "**/*.jpg" --status=404
playwright-cli route "https://api.example.com/**" --body='{"mock": true}'
playwright-cli unroute
playwright-cli tracing-start
playwright-cli tracing-stop
```
