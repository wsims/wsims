import { readFile, writeFile, mkdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root));
const write = (path, value) => writeFile(new URL(path, root), value);
const escape = (value) => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const rect = (x, y, width, height, fill, extra = "") => `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" ${extra}/>`;
const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const svg = (width, height, title, description, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">${escape(title)}</title><desc id="desc">${escape(description)}</desc>${body}</svg>\n`;

const themes = {
  dark: { ink: "#e6edf3", badge: "#151c24", badgeBorder: "#303740", reflection: "#dfc79c" },
  light: { ink: "#242b2a", badge: "#f6f8f7", badgeBorder: "#dce2de", reflection: "#fffcef" },
};

const icons = {
  x: '<path fill="currentColor" d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.59-6.64 7.59H.47l8.6-9.83L0 1.15h7.59l5.25 6.93ZM17.61 20.64h2.04L6.49 3.24H4.3Z"/>',
  linkedin: '<path fill="currentColor" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/>',
  website: '<g fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></g>',
};
const socials = {
  x: { text: "@willsims", width: 104, length: 56 },
  linkedin: { text: "Will Sims", width: 100, length: 52 },
  website: { text: "willsims.co", width: 110, length: 62 },
};

function badge(theme, key) {
  const { text, width, length } = socials[key];
  return svg(width, 32, text, `${key === "x" ? "X" : key === "linkedin" ? "LinkedIn" : "Website"}: ${text}`, `
    <rect x=".5" y=".5" width="${width - 1}" height="31" rx="15.5" fill="${theme.badge}" stroke="${theme.badgeBorder}"/>
    <svg x="11" y="9" width="14" height="14" viewBox="0 0 24 24" color="${theme.ink}">${icons[key]}</svg>
    <text x="32" y="20.5" fill="${theme.ink}" font-family="${font}" font-size="12.2" font-weight="550" textLength="${length}" lengthAdjust="spacing">${text}</text>
  `);
}

async function stoa(theme, mode) {
  const source = await read(`source/stoa-${mode === "dark" ? "night" : "day"}.webp`);
  const ripples = Array.from({ length: 15 }, (_, i) => {
    const x = 25 + (i * 79) % 380;
    const y = 560 + (i * 13) % 51;
    return rect(x, y, 4 + i % 4 * 3, 1, theme.reflection, `class="ripple" style="animation-delay:-${(i * .67).toFixed(2)}s;animation-duration:${4 + i % 5}s"`);
  }).join("");
  return svg(2048, 683, "Ionic stoa", "An original pixel art illustration of weathered Ionic columns and olive trees beside a quiet shore. Small reflections shimmer gently on the water.", `
    <defs><clipPath id="frame"><rect width="2048" height="683" rx="20"/></clipPath></defs>
    <style>.ripple{opacity:.12;animation:water 6s ease-in-out infinite}@keyframes water{0%,100%{opacity:.03}50%{opacity:.4}}@media(prefers-reduced-motion:reduce){.ripple{animation:none;opacity:.12}}</style>
    <g clip-path="url(#frame)">
      <image width="2048" height="683" href="data:image/webp;base64,${source.toString("base64")}"/>
      <g shape-rendering="crispEdges">${ripples}</g>
    </g>
  `);
}

async function odyssey() {
  const source = await read("source/odyssey.webp");
  return svg(2164, 727, "Odyssey", "A torchlit Greek sanctuary overlooks a vivid blue sea, with a distant sail beneath violet and gold skies.", `
    <defs><clipPath id="frame"><rect width="2164" height="727" rx="20"/></clipPath></defs>
    <image width="2164" height="727" href="data:image/webp;base64,${source.toString("base64")}" clip-path="url(#frame)"/>
  `);
}

await mkdir(new URL("assets/", root), { recursive: true });
await write("assets/odyssey.svg", await odyssey());
for (const [mode, theme] of Object.entries(themes)) {
  await write(`assets/stoa-${mode}.svg`, await stoa(theme, mode));
  for (const key of Object.keys(socials)) await write(`assets/social-${key}-${mode}.svg`, badge(theme, key));
}
console.log("Rendered Odyssey artwork, preserved stoa variants, and social buttons.");
