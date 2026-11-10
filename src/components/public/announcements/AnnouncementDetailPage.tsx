
"use client";

import { useEffect, useState } from "react";
import NextLink from "@/components/shared/NextLink";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

import type { Announcement } from "@/types/database";

import LoadingState from "@/components/shared/LoadingState";
import AnnouncementAttachments from "./AnnouncementAttachments";

import {
  announcementTypeLabels,
  formatAnnouncementDate,
  getAnnouncementImagePath,
} from "./constants";

import { formatEventDate } from "@/lib/announcements/date";

type AnnouncementDetailPageProps = {
  slug: string;
};

type AnnouncementDetailResponse = {
  data?: Announcement;
  message?: string;
};

export function AnnouncementDetailPage({
  slug,
}: AnnouncementDetailPageProps) {
  const [data, setData] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError("");
    setData(null);

    fetch(
      `/api/public/announcements/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    )
      .then(async (response) => {
        const body =
          (await response.json()) as AnnouncementDetailResponse;

        if (!response.ok) {
          throw new Error(
            body.message || "Không thể tải thông báo.",
          );
        }

        if (!body.data) {
          throw new Error("Không tìm thấy thông báo.");
        }

        return body.data;
      })
      .then((value) => {
        if (active) setData(value);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Không thể tải thông báo.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const hasAttachments = Boolean(data?.attachments?.length);

  const imageUrl = data
    ? getAnnouncementImagePath(
      data.type,
      data.cover_image_url,
    )
    : "";

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 3, sm: 4, md: 6 },
      }}
    >
      {/* Back button */}
      <Button
        component={NextLink}
        href="/announcements"
        startIcon={<ArrowBackOutlinedIcon />}
        sx={{
          mb: 3,
          px: 0,
          textTransform: "none",
          fontWeight: 700,
          color: "#39735E",
          "&:hover": {
            bgcolor: "transparent",
            color: "#145A39",
          },
        }}
      >
        Quay lại danh sách thông báo
      </Button>

      {loading ? (
        <LoadingState />
      ) : error || !data ? (
        <Alert severity="error">
          {error || "Không tìm thấy thông báo."}
        </Alert>
      ) : (
        <Stack spacing={{ xs: 2.5, md: 3 }}>
          {/* Announcement cover image */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: {
                xs: 200,
                sm: 280,
                md: 340,
              },
              overflow: "hidden",
              borderRadius: { xs: 2.5, sm: 3.5 },
              bgcolor: "#EAF3ED",
            }}
          >
            <Box
              component="img"
              src={imageUrl}
              alt={data.title}
              loading="eager"
              sx={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />

            {/* Image overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.02) 35%, rgba(0,0,0,0.48) 100%)",
                pointerEvents: "none",
              }}
            />

            <Chip
              label={
                announcementTypeLabels[data.type] ??
                "Thông báo"
              }
              sx={{
                position: "absolute",
                top: { xs: 12, sm: 18 },
                left: { xs: 12, sm: 18 },
                height: 32,
                bgcolor: "rgba(255,255,255,0.95)",
                color: "#176B50",
                fontWeight: 800,
                fontSize: 12,
                zIndex: 1,
              }}
            />

            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 2.5 },
                zIndex: 1,
              }}
            >
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: { xs: 11, sm: 12 },
                  fontWeight: 700,
                  letterSpacing: 0.6,
                }}
              >
                TRẠM Y TẾ XÃ TUYÊN SƠN
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  color: "#FFFFFF",
                  fontSize: {
                    xs: 17,
                    sm: 21,
                    md: 24,
                  },
                  fontWeight: 800,
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {data.title}
              </Typography>
            </Box>
          </Box>

          {/* Announcement heading */}
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              flexWrap="wrap"
              gap={1}
            >
              <Chip
                color="primary"
                variant="outlined"
                label={
                  announcementTypeLabels[data.type] ??
                  "Thông báo"
                }
              />

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Đăng ngày {formatAnnouncementDate(data.published_at)}
              </Typography>
            </Stack>

            <Typography
              component="h1"
              sx={{
                mt: 1.5,
                color: "#164F40",
                fontSize: {
                  xs: 23,
                  sm: 29,
                  md: 34,
                },
                fontWeight: 900,
                lineHeight: 1.4,
              }}
            >
              {data.title}
            </Typography>

            {data.facility?.name ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {data.facility.name}
              </Typography>
            ) : (
              <Chip
                label="Áp dụng tại cả 2 điểm trạm"
                size="small"
                color="success"
                variant="outlined"
                sx={{
                  mt: 1,
                  height: 28,
                  width: "fit-content",
                  bgcolor: "#F0F8F2",
                  borderColor: "#B9DFC6",
                  color: "#167044",
                  fontWeight: 700,
                  fontSize: 12,
                  borderRadius: 1.5,
                  "& .MuiChip-label": {
                    px: 1.25,
                  },
                }}
              />
            )}
          </Box>

          {/* Event date */}
          {data.event_date && (
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: "#B9DFC6",
                bgcolor: "#F0F8F2",
                boxShadow: "none",
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  "&:last-child": {
                    pb: { xs: 2, sm: 2.5 },
                  },
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      flexShrink: 0,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 2.5,
                      bgcolor: "#D9F0E0",
                      color: "#167044",
                    }}
                  >
                    <EventAvailableOutlinedIcon
                      sx={{ fontSize: 26 }}
                    />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: "#397354",
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: 0.7,
                      }}
                    >
                      NGÀY DIỄN RA HOẠT ĐỘNG
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.25,
                        color: "#145A39",
                        fontSize: {
                          xs: 17,
                          sm: 21,
                        },
                        fontWeight: 900,
                      }}
                    >
                      {formatEventDate(data.event_date)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          {data.summary && (
            <Box
              sx={{
                px: { xs: 2, sm: 2.5 },
                py: 2,
                borderLeft: "4px solid #278267",
                borderRadius: "0 12px 12px 0",
                bgcolor: "#F3F8F5",
              }}
            >
              <Typography
                sx={{
                  color: "#355D4C",
                  fontSize: { xs: 14, sm: 15 },
                  fontWeight: 700,
                  lineHeight: 1.9,
                }}
              >
                {data.summary}
              </Typography>
            </Box>
          )}

          {/* Main content and attachments */}
          <Grid
            container
            spacing={{ xs: 2, md: 2.5 }}
            alignItems="stretch"
          >
            {/* Article content */}
            <Grid
              size={{
                xs: 12,
                md: hasAttachments ? 8 : 12,
              }}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  borderColor: "#E5EDE8",
                  boxShadow: "none",
                }}
              >
                <CardContent
                  sx={{
                    p: {
                      xs: 2.25,
                      sm: 3,
                      md: 3.5,
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <ArticleOutlinedIcon
                      sx={{
                        color: "#278267",
                        fontSize: 22,
                      }}
                    />

                    <Typography
                      component="h2"
                      fontWeight={800}
                      fontSize={17}
                      color="#164F40"
                    >
                      Nội dung thông báo
                    </Typography>
                  </Stack>

                  <Divider sx={{ mb: 2.5 }} />

                  <Typography
                    sx={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      color: "#43574D",
                      lineHeight: 2,
                      fontSize: {
                        xs: 14,
                        sm: 15,
                        md: 15.5,
                      },
                    }}
                  >
                    {data.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Attachments sidebar */}
            {hasAttachments && (
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    borderColor: "#E5EDE8",
                    bgcolor: "#FAFCFB",
                    boxShadow: "none",
                  }}
                >
                  <CardContent
                    sx={{
                      p: {
                        xs: 2.25,
                        sm: 2.5,
                      },
                    }}
                  >
                    <Typography
                      component="h2"
                      fontWeight={800}
                      fontSize={16}
                      color="#164F40"
                    >
                      Tài liệu đính kèm
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        mb: 2,
                        lineHeight: 1.7,
                      }}
                    >
                      Tài liệu liên quan đến thông báo và hoạt động.
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <AnnouncementAttachments
                      attachments={data.attachments ?? []}
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          {/* Bottom navigation */}
          <Box
            sx={{
              pt: 2,
              borderTop: "1px solid #E7EEE9",
            }}
          >
            <Button
              component={NextLink}
              href="/announcements"
              startIcon={<ArrowBackOutlinedIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                color: "#39735E",
              }}
            >
              Xem các thông báo khác
            </Button>
          </Box>
        </Stack>
      )}
    </Container>
  );
}
