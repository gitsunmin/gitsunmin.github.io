#!/usr/bin/env bun
/**
 * 빌드 전 실행되는 이미지 최적화 스크립트.
 *
 * public/assets/blog 아래의 PNG/JPG 파일을 WebP로 변환하고,
 * src/content/blog 의 MDX 파일 내 해당 경로 참조를 함께 업데이트한다.
 *
 * - 이미 WebP가 존재하고 원본이 없으면 변환 없이 건너뛴다 (재빌드 시 멱등성 보장).
 * - 원본 PNG/JPG는 변환 성공 후 삭제한다.
 */
import sharp from 'sharp';
import { readdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { join, basename } from 'node:path';

const BLOG_ASSETS_DIR = join(process.cwd(), 'public/assets/blog');
const CONTENT_DIR = join(process.cwd(), 'src/content/blog');
const WEBP_QUALITY = 82;
const RASTER_EXT = /\.(png|jpe?g)$/i;

async function findFiles(dir: string, test: (name: string) => boolean): Promise<string[]> {
  const results: string[] = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findFiles(full, test)));
    } else if (entry.isFile() && test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

function toPublicUrl(absPath: string): string {
  return absPath.slice(join(process.cwd(), 'public').length).replace(/\\/g, '/');
}

async function convertToWebP(src: string): Promise<string> {
  const dest = src.replace(RASTER_EXT, '.webp');
  await sharp(src).webp({ quality: WEBP_QUALITY }).toFile(dest);
  await unlink(src);
  return dest;
}

async function updateMdxPaths(srcUrl: string, destUrl: string): Promise<void> {
  const mdxFiles = await findFiles(CONTENT_DIR, (n) => n.endsWith('.mdx'));
  for (const file of mdxFiles) {
    const content = await readFile(file, 'utf-8');
    if (!content.includes(srcUrl)) continue;
    await writeFile(file, content.replaceAll(srcUrl, destUrl), 'utf-8');
    console.log(`  [mdx] ${basename(file)}: ${srcUrl} → ${destUrl}`);
  }
}

async function main(): Promise<void> {
  const images = await findFiles(BLOG_ASSETS_DIR, (n) => RASTER_EXT.test(n));

  if (images.length === 0) {
    console.log('[optimize-blog-images] No PNG/JPG files found — skipping.');
    return;
  }

  console.log(`[optimize-blog-images] Converting ${images.length} image(s)...`);

  for (const src of images) {
    const srcUrl = toPublicUrl(src);
    const dest = await convertToWebP(src);
    const destUrl = toPublicUrl(dest);
    console.log(`  ${basename(src)} → ${basename(dest)}`);
    await updateMdxPaths(srcUrl, destUrl);
  }

  console.log('[optimize-blog-images] Done.');
}

main().catch((err) => {
  console.error('[optimize-blog-images] Failed:', err);
  process.exit(1);
});
