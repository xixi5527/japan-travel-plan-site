#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "index.html",
  "styles.css",
  "app.js",
  "overview-map.js",
  "route-ui.js",
  "runtime-storage.js",
  "trip-data.json"
];
const errors = [];

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`缺少网页文件：${file}`);
}

let trip;
try {
  trip = JSON.parse(fs.readFileSync(path.join(root, "trip-data.json"), "utf8"));
} catch (error) {
  errors.push(`trip-data.json 无法解析：${error.message}`);
}

if (trip) {
  if (trip.metadata?.title !== "日本关西｜红叶温泉之旅") errors.push("旅行标题不正确");
  if (trip.trip?.startDate !== "2026-11-27" || trip.trip?.endDate !== "2026-12-04") errors.push("旅行日期应为 2026-11-27 至 2026-12-04");
  if (trip.trip?.dayCount !== 8 || !Array.isArray(trip.days) || trip.days.length !== 8) errors.push("每日行程必须连续包含 8 天");
  for (let index = 0; index < (trip.days || []).length; index += 1) {
    const day = trip.days[index];
    if (day.day !== index + 1 || !day.date || !Array.isArray(day.schedule)) errors.push(`Day ${index + 1} 的结构不完整`);
  }
  if (trip.trip?.groupSize !== 2) errors.push("同行人数应为 2 人");
  const mapImage = trip.routeMap?.regions?.[0]?.baseImage || trip.map?.regions?.[0]?.baseImage || trip.map?.region?.baseImage || trip.map?.baseImage;
  if (mapImage && !fs.existsSync(path.join(root, mapImage))) errors.push(`路线图资源不存在：${mapImage}`);
}

for (const script of ["app.js", "overview-map.js", "route-ui.js", "runtime-storage.js"]) {
  if (fs.existsSync(path.join(root, script)) && fs.readFileSync(path.join(root, script), "utf8").includes("<<<<<<<")) errors.push(`${script} 包含未解决的合并冲突`);
}

if (errors.length) {
  console.error(errors.map((item) => `✗ ${item}`).join("\n"));
  process.exit(1);
}

console.log("✓ 日本旅行网页校验通过：核心文件、日期、8日行程与路线图资源完整");
