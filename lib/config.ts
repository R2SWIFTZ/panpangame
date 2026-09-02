// Tagline is kept as phrases so the footer can forbid line breaks inside each
// one — browsers otherwise split Thai runs at odd spots ("ออเด|อร์", "ส่ง|ไว").
const TAGLINE_PARTS = ["ร้านขายรหัส Free Fire", "ปลอดภัย ส่งไว", "มีแอดมินดูแลทุกออเดอร์"];

export const siteConfig = {
  name: "panpangame",
  taglineParts: TAGLINE_PARTS,
  tagline: TAGLINE_PARTS.join(" "),
  lineUrl: "https://line.me/R/ti/p/@pandazone",
  lineId: "@pandazone",
  openHours: "เปิดทุกวัน 7:00 - 01:00 น.",
};
