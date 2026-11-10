"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";

import { Box, IconButton, Skeleton, Stack, Typography } from "@mui/material";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import type { HeroSlide } from "@/lib/hero-slides";

const AUTO_SLIDE_INTERVAL = 5000;

type ResponsiveSize =
    | string
    | number
    | {
        xs?: string | number;
        sm?: string | number;
        md?: string | number;
        lg?: string | number;
        xl?: string | number;
    };

type HeroImageSliderProps = {
    width?: ResponsiveSize;
    maxWidth?: ResponsiveSize;
    aspectRatio?: ResponsiveSize;
};

// Style dùng chung cho hai nút chuyển ảnh.
const arrowButtonSx = (side: "left" | "right") => ({
    position: "absolute" as const,
    top: 0,
    bottom: 0,
    [side]: 0,

    width: { xs: 44, sm: 54 },
    minWidth: { xs: 44, sm: 54 },
    height: "100%",

    p: 0,
    borderRadius: 0,
    color: "rgba(255,255,255,0.9)",
    bgcolor: "transparent",

    overflow: "hidden",
    transition: "color 250ms ease",

    "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        opacity: 0,
        pointerEvents: "none",
        transition: "opacity 300ms ease",
        background:
            side === "left"
                ? "linear-gradient(90deg, rgba(0,0,0,0.42), rgba(0,0,0,0.16) 65%, transparent)"
                : "linear-gradient(270deg, rgba(0,0,0,0.42), rgba(0,0,0,0.16) 65%, transparent)",
    },

    "&:hover": {
        bgcolor: "transparent",
        color: "#FFFFFF",
        "&::before": {
            opacity: 1,
        },
    },

    "&:focus-visible": {
        outline: "2px solid #FFFFFF",
        outlineOffset: -3,
        "&::before": {
            opacity: 1,
        },
    },

    "&:active::before": {
        opacity: 1,
    },

    "& > svg": {
        position: "relative",
        zIndex: 1,
        fontSize: { xs: 30, sm: 34 },
    },
});

export default function HeroImageSlider({
    width = "100%",
    maxWidth = { xs: 460, md: 380, lg: 540 },
    aspectRatio = { xs: "16 / 10", md: "1.15 / 1" },
}: HeroImageSliderProps) {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [loading, setLoading] = useState(true);

    const touchStartRef = useRef<{
        x: number;
        y: number;
    } | null>(null);

    // Tự động lấy ảnh từ public/slides thông qua API.
    useEffect(() => {
        const controller = new AbortController();

        async function loadSlides() {
            try {
                const response = await fetch("/api/public/hero-slides", {
                    cache: "no-store",
                    signal: controller.signal,
                });

                const body: {
                    data?: HeroSlide[];
                    message?: string;
                } = await response.json();

                if (!response.ok) {
                    throw new Error(body.message || "Không thể tải hình ảnh.");
                }

                if (!controller.signal.aborted) {
                    setSlides(Array.isArray(body.data) ? body.data : []);
                    setActiveIndex(0);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error("Load hero slides:", error);
                    setSlides([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadSlides();

        return () => controller.abort();
    }, []);

    const totalSlides = slides.length;
    const activeSlide = slides[activeIndex];

    // Tự động chuyển ảnh.
    useEffect(() => {
        if (paused || totalSlides <= 1) return;

        const interval = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % totalSlides);
        }, AUTO_SLIDE_INTERVAL);

        return () => window.clearInterval(interval);
    }, [paused, totalSlides]);

    function goToPrevious() {
        setActiveIndex((current) =>
            current === 0 ? totalSlides - 1 : current - 1,
        );
    }

    function goToNext() {
        setActiveIndex((current) => (current + 1) % totalSlides);
    }

    function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
        const touch = event.touches[0];

        if (!touch) return;

        touchStartRef.current = {
            x: touch.clientX,
            y: touch.clientY,
        };
    }

    function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
        const start = touchStartRef.current;
        touchStartRef.current = null;

        const touch = event.changedTouches[0];

        if (!start || !touch) return;

        const deltaX = touch.clientX - start.x;
        const deltaY = touch.clientY - start.y;

        // Chỉ nhận thao tác vuốt ngang, không ảnh hưởng cuộn trang.
        if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) {
            return;
        }

        if (deltaX < 0) {
            goToNext();
        } else {
            goToPrevious();
        }
    }

    function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
        const nextTarget = event.relatedTarget as Node | null;

        if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
            setPaused(false);
        }
    }

    return (
        <Box
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={handleBlur}
            role="region"
            aria-label="Hình ảnh hoạt động của Trạm Y tế"
            sx={{
                position: "relative",
                width,
                maxWidth,
                mx: "auto",
                px: { xs: 0.5, md: 1.5 },
                py: { xs: 1, md: 2 },
            }}
        >
            {/* Decorative circles */}
            <Box
                sx={{
                    position: "absolute",
                    inset: { xs: -2, md: -8 },
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.24)",
                    pointerEvents: "none",
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    inset: { xs: 12, md: 8 },
                    borderRadius: "50%",
                    border: "1px dashed rgba(255,255,255,0.2)",
                    pointerEvents: "none",
                }}
            />

            {/* Image frame */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    aspectRatio,
                    touchAction: "pan-y",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    overflow: "hidden",
                    borderRadius: { xs: 3, sm: 4 },
                    bgcolor: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 18px 45px rgba(0,0,0,0.2)",
                    "@keyframes heroImageEnter": {
                        from: {
                            opacity: 0.5,
                            transform: "scale(1.025)",
                        },
                        to: {
                            opacity: 1,
                            transform: "scale(1)",
                        },
                    },
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={() => {
                    touchStartRef.current = null;
                }}
            >
                {loading ? (
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        animation="wave"
                        sx={{
                            bgcolor: "rgba(255,255,255,0.12)",
                        }}
                    />
                ) : activeSlide ? (
                    <>
                        <Box
                            key={activeSlide.src}
                            component="img"
                            src={activeSlide.src}
                            alt={activeSlide.alt}
                            loading={activeIndex === 0 ? "eager" : "lazy"}
                            sx={{
                                display: "block",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                animation: "heroImageEnter 550ms ease both",
                            }}
                        />

                        {/* Image overlay */}
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(180deg, rgba(0,0,0,0.03) 45%, rgba(0,0,0,0.28) 100%)",
                                pointerEvents: "none",
                            }}
                        />

                        {/* Previous */}
                        {totalSlides > 1 && (
                            <IconButton
                                aria-label="Ảnh trước"
                                onClick={goToPrevious}
                                sx={arrowButtonSx("left")}
                            >
                                <ChevronLeftRoundedIcon />
                            </IconButton>
                        )}

                        {/* Next */}
                        {totalSlides > 1 && (
                            <IconButton
                                aria-label="Ảnh tiếp theo"
                                onClick={goToNext}
                                sx={arrowButtonSx("right")}
                            >
                                <ChevronRightRoundedIcon />
                            </IconButton>
                        )}

                        {/* Slide indicators */}
                        {totalSlides > 1 && (
                            <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={0.8}
                                sx={{
                                    position: "absolute",
                                    bottom: { xs: 12, sm: 16 },
                                    left: 0,
                                    right: 0,
                                }}
                            >
                                {slides.map((slide, index) => (
                                    <Box
                                        key={slide.src}
                                        component="button"
                                        type="button"
                                        aria-label={`Chuyển đến ảnh ${index + 1}`}
                                        aria-current={activeIndex === index ? "true" : undefined}
                                        onClick={() => setActiveIndex(index)}
                                        sx={{
                                            width: activeIndex === index ? 22 : 7,
                                            height: 7,
                                            p: 0,
                                            border: 0,
                                            borderRadius: 10,
                                            cursor: "pointer",
                                            bgcolor:
                                                activeIndex === index
                                                    ? "#FFFFFF"
                                                    : "rgba(255,255,255,0.55)",
                                            transition: "all 220ms ease",
                                            "&:hover": {
                                                bgcolor: "#FFFFFF",
                                            },
                                        }}
                                    />
                                ))}
                            </Stack>
                        )}
                    </>
                ) : (
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}
                        sx={{
                            width: "100%",
                            height: "100%",
                            color: "rgba(255,255,255,0.8)",
                            p: 2,
                            textAlign: "center",
                        }}
                    >
                        <Typography fontWeight={700}>Hình ảnh hoạt động</Typography>
                        <Typography variant="caption">
                            Hình ảnh sẽ được cập nhật tại đây.
                        </Typography>
                    </Stack>
                )}
            </Box>
        </Box>
    );
}
