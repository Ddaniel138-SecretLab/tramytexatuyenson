import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { InputAdornment, TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type PublicSearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
};

export default function PublicSearchField({
  value,
  onChange,
  placeholder,
  label,
  fullWidth = true,
  sx,
}: PublicSearchFieldProps) {
  return (
    <TextField
      fullWidth={fullWidth}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      size="small"
      label={label}
      placeholder={placeholder}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
      sx={[
        {
          "& .MuiOutlinedInput-root": {
            minHeight: 44,
            borderRadius: 2.5,
            bgcolor: "background.paper",
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  );
}
