
import { NextResponse } from "next/server";

import { getHeroSlides } from "@/lib/hero-slides";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slides = await getHeroSlides();

    return NextResponse.json(
      {
        success: true,
        data: slides,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("Get public hero slides:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể tải danh sách hình ảnh.",
      },
      { status: 500 },
    );
  }
}
