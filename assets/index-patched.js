// Runtime patch layer for the prebuilt profile bundle.
// This keeps the original generated asset intact while applying small content
// and theme-behavior fixes without requiring the original source tree.
const originalUrl = "/assets/index-Dy90beag.js";
const response = await fetch(originalUrl);
let source = await response.text();

source = source.replaceAll("{zhongguo|中国}", "中国");
source = source.replaceAll(
  "https://www.researchgate.net/profile/Zekai-Shi?ev=hdr_xprf",
  "https://scholar.google.com/citations?user=ThRaJWoAAAAJ&hl=en&oi=ao"
);
source = source.replace(
  'news:[{date:"2026.01"',
  'news:[{date:"2026.09",en:{text:"Latest paper accepted by IEEE Transactions on Geoscience and Remote Sensing (TGRS)",type:"JOURNAL"},zh:{text:"最新论文已被 IEEE Transactions on Geoscience and Remote Sensing (TGRS) 接收",type:"期刊"}},{date:"2026.01"'
);
source = source.replace(
  'function nh(){const[x,D]=hl.useState("retro")',
  'function nh(){const[x,D]=hl.useState(()=>window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"modern":"retro")'
);
source = source.replace(
  'Sl=G=>{U({show:!0,msg:G}),setTimeout(()=>U({show:!1,msg:""}),3e3)};return hl.useEffect',
  'Sl=G=>{U({show:!0,msg:G}),setTimeout(()=>U({show:!1,msg:""}),3e3)};hl.useEffect(()=>{const G=window.matchMedia("(prefers-color-scheme: dark)"),vl=()=>D(G.matches?"modern":"retro");return G.addEventListener?.("change",vl),()=>G.removeEventListener?.("change",vl)},[]);return hl.useEffect'
);

const patchedUrl = URL.createObjectURL(new Blob([source], {type: "text/javascript"}));
try {
  await import(patchedUrl);
} finally {
  URL.revokeObjectURL(patchedUrl);
}
