
"use client";

import { Box, Container, Grid } from "@mui/material";

import HomeHeroContent from "./HomeHeroContent";
import HeroImageSlider from "./HeroImageSlider";

export default function HomeHero() {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(120deg, #075B53 0%, #087C70 55%, #2C9B7B 100%)",
        color: "#FFFFFF",
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={{ xs: 4, md: 5 }}
          sx={{
            alignItems: "center",
            py: { xs: 7, sm: 9, md: 13 },
            minHeight: { md: 500 },
          }}
        >
          <Grid size={{ xs: 12, md: 7 }}>
            <HomeHeroContent />
          </Grid>

          <Grid
            size={{ xs: 12, md: 5 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <HeroImageSlider />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
