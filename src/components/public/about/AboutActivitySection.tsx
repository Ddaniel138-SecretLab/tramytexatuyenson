"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";

type AboutActivityProps = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
  icon: ReactNode;
  highlights: string[];
  reverse?: boolean;
};

export function AboutActivitySection({
  number,
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  imageCaption,
  icon,
  highlights,
  reverse = false,
}: AboutActivityProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      variant="outlined"
      sx={{
        overflow: "hidden",
        borderRadius: 4,
        borderColor: "#E5EDE8",
        boxShadow: "0 8px 30px rgba(24,74,57,0.045)",
        transition: "box-shadow .25s ease",
        "&:hover": { boxShadow: "0 14px 38px rgba(24,74,57,0.09)" },
      }}
    >
      <Grid
        container
        sx={{ flexDirection: { xs: "column", md: reverse ? "row-reverse" : "row" } }}
      >
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 240, sm: 300, md: "100%" },
              minHeight: { md: 350 },
              overflow: "hidden",
              bgcolor: "#E8F2EC",
            }}
          >
            {!imageError ? (
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 42vw"
                style={{ objectFit: "cover", objectPosition: "center" }}
                onError={() => setImageError(true)}
              />
            ) : (
              <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ height: "100%", color: "#39816B" }}>
                <Box sx={{ width: 76, height: 76, display: "grid", placeItems: "center", borderRadius: "50%", bgcolor: "#D8EBDF", "& svg": { fontSize: 40 } }}>
                  {icon}
                </Box>
                <Typography fontSize={13} color="text.secondary">Hình ảnh hoạt động</Typography>
              </Stack>
            )}

            <Box sx={{ position: "absolute", top: 18, left: 18, px: 1.5, py: 0.75, borderRadius: 2, bgcolor: "rgba(255,255,255,0.94)", color: "#17634F", fontSize: 12, fontWeight: 800, zIndex: 1 }}>
              HOẠT ĐỘNG {number}
            </Box>
            <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 2, background: "linear-gradient(transparent, rgba(0,0,0,0.65))", zIndex: 1 }}>
              <Typography sx={{ color: "#FFFFFF", fontSize: 13, fontWeight: 700 }}>{imageCaption}</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <CardContent
            sx={{
              p: { xs: 2.5, sm: 3.5, md: 4, lg: 5 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              "&:last-child": { pb: { xs: 2.5, sm: 3.5, md: 4, lg: 5 } },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{ width: 48, height: 48, flexShrink: 0, display: "grid", placeItems: "center", borderRadius: 2.5, bgcolor: "#E8F4ED", color: "#197458", "& svg": { fontSize: 27 } }}>
                {icon}
              </Box>
              <Typography sx={{ color: "#268268", fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>
                {eyebrow}
              </Typography>
            </Stack>

            <Typography component="h3" sx={{ mt: 2.5, color: "#164F40", fontSize: { xs: 21, sm: 24, md: 25, lg: 28 }, fontWeight: 800, lineHeight: 1.4 }}>
              {title}
            </Typography>
            <Typography sx={{ mt: 1.75, color: "#62736B", fontSize: { xs: 14, sm: 14.5 }, lineHeight: 2 }}>
              {description}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2.5 }}>
              {highlights.map((item) => (
                <Chip key={item} label={item} size="small" variant="outlined" sx={{ height: 30, borderRadius: 2, bgcolor: "#F5FAF7", borderColor: "#DCEBE1", color: "#39735E", fontSize: 11.5, fontWeight: 600 }} />
              ))}
            </Stack>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
}
