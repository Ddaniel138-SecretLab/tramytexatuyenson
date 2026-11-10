import { Avatar, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import type { Profile } from "@/types/database";

type PublicStaff = Profile;

type StaffCardProps = {
  person: PublicStaff;
};

export default function StaffCard({ person }: StaffCardProps) {
  const initials = person.full_name.trim().charAt(0).toLocaleUpperCase("vi-VN") || "C";

  return (
    <Card
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        boxShadow: "0 5px 22px rgba(22,72,57,0.035)",
        transition: "transform .2s ease, box-shadow .2s ease",
        "&:hover": {
          transform: { md: "translateY(-4px)" },
          boxShadow: "0 12px 28px rgba(20,60,50,0.09)",
        },
      }}
    >
      <CardContent sx={{ p: 2.75, textAlign: "center" }}>
        <Avatar
          src={person.avatar_url ?? undefined}
          alt={person.full_name}
          sx={{
            width: 84,
            height: 84,
            mx: "auto",
            bgcolor: "primary.light",
            color: "primary.dark",
            fontSize: 30,
            fontWeight: 800,
            border: "3px solid",
            borderColor: "#E3F1E8",
          }}
        >
          {initials}
        </Avatar>

        <Typography component="h2" fontWeight={800} sx={{ mt: 1.8, lineHeight: 1.5 }}>
          {person.full_name}
        </Typography>
        <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mt: 0.5 }}>
          {person.position || "Cán bộ y tế"}
        </Typography>

        <Divider sx={{ my: 1.75 }} />

        <Stack spacing={0.75} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {person.facility?.name ?? "Chưa phân cơ sở"}
          </Typography>
          {person.phone && (
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {person.phone}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
