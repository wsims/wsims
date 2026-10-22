import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const port = Number(process.env.PORT || 4175);
const types = { svg: "image/svg+xml", webp: "image/webp" };

const style = `
  *{box-sizing:border-box}body{margin:0;background:#0d1117;color:#e6edf3;font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:40px 20px}
  .toolbar{max-width:894px;margin:0 auto 18px;display:flex;justify-content:space-between;align-items:center;font:12px ui-monospace,monospace;color:#8b949e}
  button{border:1px solid #30363d;border-radius:6px;background:#161b22;color:inherit;padding:8px 12px;cursor:pointer}button:focus-visible{outline:2px solid #58a6ff;outline-offset:3px}
  article{max-width:894px;margin:auto;border:1px solid #30363d;border-radius:6px;padding:24px 32px 10px}.repo{font:12px ui-monospace,monospace;color:#8b949e;margin:0 0 24px}
  article>p{margin:16px 0}picture{display:inline-block;max-width:100%}img{vertical-align:middle;max-width:100%}img[width="100%"]{width:100%;height:auto}a{color:#58a6ff;text-decoration:none}a:hover{text-decoration:underline}
  article>p:first-of-type{margin:0 0 20px}article>p:first-of-type a{display:inline-block;margin:0 1px 4px 0}article>p:nth-of-type(2){margin-bottom:24px}
  h1{font-size:32px;line-height:1.25;border-bottom:1px solid #30363d;padding-bottom:10px;margin:0 0 18px;font-weight:600}ul{margin:24px 0;padding-left:26px}li+li{margin-top:6px}
  body.light{background:#fff;color:#1f2328}.light article,.light h1,.light button{border-color:#d1d9e0}.light button{background:#f6f8fa}.light a{color:#0969da}
  @media(max-width:600px){body{padding:20px 10px}article{padding:16px 12px 4px}.toolbar{font-size:10px}h1{font-size:28px}}
`;

createServer(async (request, response) => {
  const path = new URL(request.url, "http://localhost").pathname;
  try {
    if (path === "/" || path === "/preview.html") {
      const readme = await readFile(new URL("README.md", root), "utf8");
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Will Sims · GitHub profile preview</title><style>${style}</style><div class="toolbar"><span>GITHUB PROFILE / LOCAL PREVIEW</span><button type="button" id="theme">Switch to light</button></div><article><div class="repo">wsims / README.md</div>${readme}</article><script>
        let light=false;function apply(){document.body.classList.toggle('light',light);document.querySelector('#theme').textContent=light?'Switch to dark':'Switch to light';for(const p of document.querySelectorAll('picture')){p.querySelector('source').media='not all';const img=p.querySelector('img');img.src=img.getAttribute('src').replace(/-(light|dark)\\.svg/,light?'-light.svg':'-dark.svg')}}document.querySelector('#theme').addEventListener('click',()=>{light=!light;apply()});apply();
      </script></html>`);
      return;
    }
    if (!/^\/assets\/[a-z-]+\.svg$/.test(path)) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.setHeader("Content-Type", types[path.split(".").at(-1)]);
    response.end(await readFile(new URL(`.${path}`, root)));
  } catch {
    response.writeHead(404).end("Not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`Profile preview: http://127.0.0.1:${port}`));
