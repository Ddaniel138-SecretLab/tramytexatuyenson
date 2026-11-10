/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

interface AnnouncementImagePickerProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function AnnouncementImagePicker({
  file,
  onChange,
}: AnnouncementImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleSelect = (selectedFile?: File) => {
    setError("");

    if (!selectedFile) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type)) {
      setError("Chỉ hỗ trợ ảnh JPEG, PNG hoặc WebP.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (selectedFile.size > MAX_IMAGE_SIZE) {
      setError("Ảnh không được vượt quá 5 MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    onChange(selectedFile);
  };

  const handleRemove = () => {
    onChange(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Stack spacing={1.5}>
      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
        Ảnh đại diện
      </Typography>

      {previewUrl ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 420,
            aspectRatio: "16 / 9",
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "action.hover",
          }}
        >
          <Box
            component="img"
            src={previewUrl}
            alt="Ảnh đại diện thông báo"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <IconButton
            aria-label="Xóa ảnh đại diện"
            onClick={handleRemove}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "error.light",
                color: "error.contrastText",
              },
            }}
          >
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Box>
      ) : (
        <Box
          onClick={() => inputRef.current?.click()}
          sx={{
            width: "100%",
            maxWidth: 420,
            aspectRatio: "16 / 9",
            border: "1.5px dashed",
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "action.hover",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            color: "text.secondary",
            transition: "all .2s",
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "action.selected",
            },
          }}
        >
          <ImageOutlinedIcon sx={{ fontSize: 38 }} />

          <Typography sx={{ mt: 1, fontWeight: 600, fontSize: 13 }}>
            Chọn ảnh đại diện
          </Typography>

          <Typography sx={{ mt: 0.5, fontSize: 11 }}>
            JPEG, PNG hoặc WebP · Tối đa 5 MB
          </Typography>
        </Box>
      )}

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddPhotoAlternateOutlinedIcon />}
          onClick={() => inputRef.current?.click()}
        >
          {file ? "Chọn ảnh khác" : "Chọn ảnh"}
        </Button>

        {file && (
          <Button
            size="small"
            color="error"
            startIcon={<DeleteOutlineOutlinedIcon />}
            onClick={handleRemove}
          >
            Xóa ảnh
          </Button>
        )}
      </Stack>

      {file && (
        <Typography
          sx={{
            fontSize: 12,
            color: "text.secondary",
            overflowWrap: "anywhere",
          }}
        >
          {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
        </Typography>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(event) => {
          handleSelect(event.target.files?.[0]);
        }}
      />
    </Stack>
  );
}