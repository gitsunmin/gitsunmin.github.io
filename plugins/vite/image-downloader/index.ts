import fs from 'node:fs';
// import path from 'node:path';
import type { PluginOption } from 'vite';

type Target = {
  url: string;
  defaultImagePath: string;
  outputPath: string;
};

async function downloadImage({ url, outputPath, defaultImagePath }: Target) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      fs.writeFileSync(outputPath, fs.readFileSync(defaultImagePath));
      return {
        result: 'error' as const,
        url,
        outputPath,
        error: `Failed to fetch image: ${response.status} ${response.statusText}`
      };
    }

    // 응답을 ArrayBuffer로 변환
    const arrayBuffer = await response.arrayBuffer();
    // Buffer로 변환하고 파일로 저장
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(outputPath, buffer);

    return {
      result: 'success' as const,
      url,
      outputPath
    };
  } catch (error) {
    fs.writeFileSync(outputPath, fs.readFileSync(defaultImagePath));
    return {
      result: 'error' as const,
      url,
      outputPath,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export type Options = {
  active?: boolean;
  targets: Target[];
};

export const imageDownloader = (options?: Options): PluginOption => {
  const { active = true, targets = [] } = options ?? {};

  return {
    name: 'image-downloader',
    apply: () => true,
    buildStart() {
      if (!active) {
        console.info('Image downloader is disabled.');
        return;
      }

      Promise.allSettled(targets.map(downloadImage));
    }
  };
};
