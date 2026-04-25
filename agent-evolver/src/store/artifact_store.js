import fs from 'node:fs/promises';
import path from 'node:path';

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeJson(root, relativePath, data) {
  const filePath = path.join(root, relativePath);
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  return filePath;
}

export async function writeText(root, relativePath, data) {
  const filePath = path.join(root, relativePath);
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, data, 'utf8');
  return filePath;
}
