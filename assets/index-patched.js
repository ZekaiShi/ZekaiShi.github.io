// Runtime patch layer for the prebuilt profile bundle.
// This keeps the original generated asset intact while applying small content
// and theme-behavior fixes without requiring the original source tree.
const originalUrl = "/assets/index-Dy90beag.js";
const response = await fetch(originalUrl);
let source = await response.text();
const [newsResponse, publicationsResponse] = await Promise.all([
  fetch("/content/news.json"),
  fetch("/content/publications.json")
]);
const news = await newsResponse.json();
const publications = await publicationsResponse.json();
const dynamicData = {
  social: {
    github: "https://github.com/ZekaiShi",
    scholar: "https://scholar.google.com/citations?user=ThRaJWoAAAAJ&hl=en&oi=ao",
    email: "mailto:shizk2000@outlook.com"
  },
  papers: publications,
  news: news.map((item) => ({
    date: item.date,
    en: {text: item.en, type: item.type},
    zh: {text: item.zh, type: item.type === "JOURNAL" ? "期刊" : item.type}
  }))
};

source = source.replace(/vf=\{social:[\s\S]*?\},Wm=/, "vf=" + JSON.stringify(dynamicData) + ",Wm=");

source = source.replaceAll("{zhongguo|中国}", "中国");
source = source.replaceAll(
  "https://www.researchgate.net/profile/Zekai-Shi?ev=hdr_xprf",
  "https://scholar.google.com/citations?user=ThRaJWoAAAAJ&hl=en&oi=ao"
);
source = source.replaceAll("西安交通大学 准博士。", "西安交通大学 博士。");
source = source.replaceAll("Incoming Ph.D. at XJTU.", "Ph.D. at XJTU.");
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
