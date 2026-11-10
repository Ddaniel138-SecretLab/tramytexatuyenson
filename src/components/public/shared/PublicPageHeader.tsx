import { Box, Typography } from "@mui/material";

type PublicPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function PublicPageHeader({
  eyebrow,
  title,
  description,
}: PublicPageHeaderProps) {
  return (
    <Box sx={{ mb: { xs: 2.5, sm: 3.5 } }}>
      <Typography color="primary.main" fontWeight={800} variant="overline">
        {eyebrow}
      </Typography>
      <Typography
        component="h1"
        variant="h4"
        sx={{ mt: 0.5, fontWeight: 900, fontSize: { xs: 27, sm: 32, md: 36 } }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          color="text.secondary"
          sx={{ mt: 1, maxWidth: 800, lineHeight: 1.8 }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}
