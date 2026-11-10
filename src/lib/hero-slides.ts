
import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";

export type HeroSlide = {
  src: string;
  alt: string;
};

export const HERO_SLIDE_FILENAME_PATTERN =
  /^picture(\d+)\.(?:jpg|jpeg)$/i;

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const directory = path.join(process.cwd(), "public", "slides");

  let files;

  try {
    files = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }

    throw error;
  }

  return files
    .filter((file) => file.isFile())
    .map((file) => {
      const match = HERO_SLIDE_FILENAME_PATTERN.exec(file.name);

      if (!match) return null;

      return {
        fileName: file.name,
        order: Number(match[1]),
      };
    })
    .filter(
      (
        file,
      ): file is {
        fileName: string;
        order: number;
      } => file !== null && Number.isSafeInteger(file.order),
    )
    .sort(
      (a, b) =>
        a.order - b.order ||
        a.fileName.localeCompare(b.fileName),
    )
    .map(({ fileName, order }) => ({
      src: `/slides/${encodeURIComponent(fileName)}`,
      alt: `Hình ảnh hoạt động ${order} tại Trạm Y tế xã Tuyên Sơn`,
    }));
}
