"use client";

import { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

interface AnnouncementAttachmentPickerProps {
  files: File[];
  onChange: (files: File[]) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 10;

export default function AnnouncementAttachmentPicker({
  files,
  onChange,
}: AnnouncementAttachmentPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const handleSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles?.length) return;

    setError("");

    const nextFiles = [...files];
    const errors: string[] = [];

    for (const file of Array.from(selectedFiles)) {
      if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        errors.push(`${file.name}: chỉ hỗ trợ PDF.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: dung lượng vượt quá 10 MB.`);
        continue;
      }

      const duplicate = nextFiles.some(
        (existing) =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified,
      );

      if (duplicate) continue;

      if (nextFiles.length >= MAX_FILES) {
        errors.push(`Chỉ được đính kèm tối đa ${MAX_FILES} file.`);
        break;
      }

      nextFiles.push(file);
    }

    onChange(nextFiles);

    if (errors.length) {
      setError(errors.join(" "));
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    onChange(files.filter((_, fileIndex) => fileIndex !== index));
    setError("");
  };

  const formatSize = (size: number) => {
    return size >= 1024 * 1024
      ? `${(size / 1024 / 1024).toFixed(2)} MB`
      : `${(size / 1024).toFixed(0)} KB`;
  };

  return (
    <Stack spacing={1.5}>
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
          Tài liệu đính kèm
        </Typography>

        <Typography sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}>
          Hỗ trợ PDF, tối đa 10 MB mỗi file và 10 file cho mỗi thông báo.
        </Typography>
      </Box>

      <Button
        variant="outlined"
        startIcon={<AttachFileOutlinedIcon />}
        onClick={() => inputRef.current?.click()}
        sx={{ alignSelf: "flex-start" }}
        disabled={files.length >= MAX_FILES}
      >
        Thêm tài liệu PDF
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        hidden
        onChange={(event) => handleSelect(event.target.files)}
      />

      {error && <Alert severity="warning">{error}</Alert>}

      {files.length > 0 && (
        <Stack spacing={1}>
          {files.map((file, index) => (
            <Box
              key={`${file.name}-${file.size}-${file.lastModified}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                minWidth: 0,
              }}
            >
              <PictureAsPdfOutlinedIcon
                color="error"
                sx={{ fontSize: 28, flexShrink: 0 }}
              />

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    overflowWrap: "anywhere",
                  }}
                >
                  {file.name}
                </Typography>

                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                  {formatSize(file.size)}
                </Typography>
              </Box>

              <IconButton
                size="small"
                color="error"
                aria-label={`Xóa file ${file.name}`}
                onClick={() => handleRemove(index)}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}

      {files.length === 0 && (
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          Chưa có tài liệu nào được chọn.
        </Typography>
      )}
    </Stack>
  );
}