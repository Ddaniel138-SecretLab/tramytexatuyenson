
import Image from "next/image";
import NextLink from "@/components/shared/NextLink";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

import type { Facility } from "@/types/database";
import { getFacilityImagePath } from "@/constants/facility-images";

type FacilityCardProps = {
  facility: Facility;
};

export default function FacilityCard({
  facility,
}: FacilityCardProps) {
  const image = getFacilityImagePath(facility.code);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 3,
        border: "1px solid #E6EEE9",
        boxShadow: "0 4px 18px rgba(24, 74, 57, 0.045)",
        transition:
          "transform .25s ease, box-shadow .25s ease",
        "&:hover": {
          transform: { md: "translateY(-5px)" },
          boxShadow:
            "0 14px 30px rgba(24, 74, 57, 0.11)",
        },
      }}
    >
      {/* Facility image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          bgcolor: "#EAF3ED",
        }}
      >
        {image ? (
          <Image
            src={image}
            alt={facility.name}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "cover",
              transition: "transform .4s ease",
            }}
          />
        ) : (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{
              width: "100%",
              height: "100%",
              color: "#39816B",
            }}
          >
            <BusinessOutlinedIcon sx={{ fontSize: 48 }} />

            <Typography variant="caption">
              Hình ảnh cơ sở y tế
            </Typography>
          </Stack>
        )}

        <Chip
          label="ĐIỂM TRẠM Y TẾ"
          size="small"
          sx={{
            position: "absolute",
            top: 14,
            left: 14,
            zIndex: 1,
            bgcolor: "rgba(255,255,255,0.94)",
            color: "#176B50",
            fontWeight: 800,
            fontSize: 10,
            letterSpacing: 0.4,
          }}
        />
      </Box>

      {/* Facility information */}
      <CardContent
        sx={{
          p: { xs: 2.25, sm: 2.75 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          "&:last-child": {
            pb: { xs: 2.25, sm: 2.75 },
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          gap={1}
        >
          <Typography
            component="h2"
            sx={{
              color: "#164F40",
              fontSize: { xs: 18, sm: 20 },
              fontWeight: 800,
              lineHeight: 1.45,
            }}
          >
            {facility.name}
          </Typography>

          {/* {facility.code && (
            <Chip
              label={facility.code}
              size="small"
              variant="outlined"
              sx={{
                flexShrink: 0,
                fontSize: 10,
              }}
            />
          )} */}
        </Stack>

        <Stack spacing={1.5} sx={{ mt: 2.5 }}>
          {facility.address && (
            <Stack
              direction="row"
              alignItems="flex-start"
              spacing={1.25}
            >
              <LocationOnOutlinedIcon
                sx={{
                  color: "#29816A",
                  fontSize: 20,
                  mt: 0.15,
                  flexShrink: 0,
                }}
              />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                >
                  Địa chỉ
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1.7, mt: 0.25 }}
                >
                  {facility.address}
                </Typography>
              </Box>
            </Stack>
          )}

          {facility.phone && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.25}
            >
              <PhoneOutlinedIcon
                sx={{
                  color: "#29816A",
                  fontSize: 19,
                  flexShrink: 0,
                }}
              />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                >
                  Điện thoại
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 0.25 }}
                >
                  {facility.phone}
                </Typography>
              </Box>
            </Stack>
          )}
        </Stack>

        {facility.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 2,
              lineHeight: 1.8,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {facility.description}
          </Typography>
        )}

        <Box sx={{ flex: 1, minHeight: 20 }} />

        <Button
          component={NextLink}
          href={`/public-staff?facilityId=${facility.id}`}
          fullWidth
          variant="outlined"
          endIcon={<ArrowForwardOutlinedIcon />}
          sx={{
            mt: 2.5,
            py: 1.15,
            borderRadius: 2,
            fontWeight: 700,
            textTransform: "none",
            borderColor: "#C9E2D5",
            color: "#167052",
            "&:hover": {
              bgcolor: "#EDF7F0",
              borderColor: "#167052",
            },
          }}
        >
          Xem cán bộ tại cơ sở
        </Button>
      </CardContent>
    </Card>
  );
}
