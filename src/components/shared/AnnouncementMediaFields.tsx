/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import type { AnnouncementAttachment } from "@/types/database";

type Props = {
  coverImageUrl: string;
  onCoverImageUrlChange: (value: string) => void;
  coverFile: File | null;
  onCoverFileChange: (value: File | null) => void;
  attachments: AnnouncementAttachment[];
  onAttachmentsChange: (value: AnnouncementAttachment[]) => void;
  attachmentFiles: File[];
  onAttachmentFilesChange: (value: File[]) => void;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PDF_SIZE = 10 * 1024 * 1024;
const MAX_ATTACHMENTS = 10;

export default function AnnouncementMediaFields(props: Props) {
  const imageInput = useRef<HTMLInputElement>(null);
  const filesInput = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState("");
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    if (!props.coverFile) {
      setLocalPreview("");
      return;
    }

    const url = URL.createObjectURL(props.coverFile);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [props.coverFile]);

  function selectImage(file?: File) {
    if (!file) return;
    setFileError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFileError("Ảnh chỉ hỗ trợ JPEG, PNG hoặc WebP.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setFileError("Ảnh không được vượt quá 5 MB.");
      return;
    }

    props.onCoverFileChange(file);
  }

  function selectFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setFileError("");

    const next = [...props.attachmentFiles];
    const errors: string[] = [];

    for (const file of Array.from(fileList)) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        errors.push(`${file.name}: chỉ hỗ trợ PDF.`);
        continue;
      }
      if (file.size > MAX_PDF_SIZE) {
        errors.push(`${file.name}: dung lượng vượt 10 MB.`);
        continue;
      }
      if (next.length + props.attachments.length >= MAX_ATTACHMENTS) {
        errors.push("Tối đa 10 file đính kèm.");
        break;
      }
      if (!next.some((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified)) {
        next.push(file);
      }
    }

    props.onAttachmentFilesChange(next);
    if (errors.length) setFileError(errors.join(" "));
    if (filesInput.current) filesInput.current.value = "";
  }

  const imageSrc = localPreview || props.coverImageUrl;
  const attachmentCount = props.attachments.length + props.attachmentFiles.length;

  return (
    <Stack spacing={2.5}>
      <Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={1}
          sx={{ mb: 1.25 }}
        >
          <Box>
            <Typography fontWeight={800} fontSize={13.5}>
              Ảnh đại diện thông báo <Typography component="span" color="text.secondary" fontWeight={400} fontSize={11.5}>(không bắt buộc)</Typography>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              JPEG, PNG hoặc WebP · Tối đa 5 MB
            </Typography>
          </Box>
          {imageSrc && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddPhotoAlternateOutlinedIcon />}
              onClick={() => imageInput.current?.click()}
            >
              Thay ảnh
            </Button>
          )}
        </Stack>

        {imageSrc ? (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: 560,
              aspectRatio: "16 / 9",
              borderRadius: 2.75,
              overflow: "hidden",
              border: "1px solid #E0E9E3",
              bgcolor: "#F1F6F3",
            }}
          >
            <Box
              component="img"
              src={imageSrc}
              alt="Ảnh xem trước thông báo"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <IconButton
              onClick={() => {
                props.onCoverFileChange(null);
                props.onCoverImageUrlChange("");
              }}
              aria-label="Xóa ảnh"
              sx={{
                position: "absolute",
                right: 10,
                top: 10,
                bgcolor: "rgba(255,255,255,.95)",
                boxShadow: 1,
                "&:hover": { bgcolor: "error.main", color: "white" },
              }}
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Box>
        ) : (
          <Card
            variant="outlined"
            onClick={() => imageInput.current?.click()}
            sx={{
              maxWidth: 560,
              minHeight: { xs: 150, sm: 190 },
              borderRadius: 2.75,
              borderStyle: "dashed",
              borderWidth: 1.5,
              borderColor: "#B7CBC3",
              bgcolor: "#F7FAF8",
              boxShadow: "none",
              cursor: "pointer",
              transition: ".2s ease",
              display: "grid",
              placeItems: "center",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "#EFF7F2",
              },
            }}
          >
            <Stack alignItems="center" spacing={1} sx={{ p: 2, textAlign: "center" }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "primary.light",
                  color: "primary.main",
                }}
              >
                <ImageOutlinedIcon sx={{ fontSize: 27 }} />
              </Box>
              <Typography fontWeight={800} fontSize={13}>
                Chọn ảnh đại diện
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ảnh sẽ giúp thông báo trực quan hơn. Nếu bỏ trống, ảnh minh họa theo loại sẽ được hiển thị.
              </Typography>
            </Stack>
          </Card>
        )}
        <input
          ref={imageInput}
          hidden
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => selectImage(event.target.files?.[0])}
        />
        {!imageSrc && (
          <Button
            sx={{ mt: 1.25 }}
            size="small"
            variant="outlined"
            startIcon={<AddPhotoAlternateOutlinedIcon />}
            onClick={() => imageInput.current?.click()}
          >
            Chọn ảnh
          </Button>
        )}
      </Box>

      <Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={1}
          sx={{ mb: 1.25 }}
        >
          <Box>
            <Typography fontWeight={800} fontSize={13.5}>
              Tài liệu đính kèm <Typography component="span" color="text.secondary" fontWeight={400} fontSize={11.5}>(không bắt buộc)</Typography>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              PDF · Tối đa 10 MB mỗi file · Tối đa 10 file
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AttachFileOutlinedIcon />}
            onClick={() => filesInput.current?.click()}
            disabled={attachmentCount >= MAX_ATTACHMENTS}
          >
            Thêm file PDF
          </Button>
        </Stack>
        <input
          ref={filesInput}
          hidden
          type="file"
          accept="application/pdf,.pdf"
          multiple
          onChange={(event) => selectFiles(event.target.files)}
        />

        {attachmentCount > 0 ? (
          <Stack spacing={1}>
            {props.attachments.map((file) => (
              <Card key={file.url} variant="outlined" sx={{ borderRadius: 2.25, boxShadow: "none" }}>
                <CardContent sx={{ p: 1.25, "&:last-child": { pb: 1.25 } }}>
                  <Stack direction="row" alignItems="center" spacing={1.25}>
                    <PictureAsPdfOutlinedIcon color="error" />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography fontSize={12.5} fontWeight={700} sx={{ overflowWrap: "anywhere" }}>
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB · Đã tải lên
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      aria-label={`Xóa ${file.name}`}
                      onClick={() => props.onAttachmentsChange(props.attachments.filter((item) => item.url !== file.url))}
                    >
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            ))}
            {props.attachmentFiles.map((file, index) => (
              <Card key={`${file.name}-${file.lastModified}`} variant="outlined" sx={{ borderRadius: 2.25, boxShadow: "none" }}>
                <CardContent sx={{ p: 1.25, "&:last-child": { pb: 1.25 } }}>
                  <Stack direction="row" alignItems="center" spacing={1.25}>
                    <PictureAsPdfOutlinedIcon color="error" />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography fontSize={12.5} fontWeight={700} sx={{ overflowWrap: "anywhere" }}>
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB · Chờ tải lên
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      aria-label={`Bỏ ${file.name}`}
                      onClick={() => props.onAttachmentFilesChange(props.attachmentFiles.filter((_, itemIndex) => itemIndex !== index))}
                    >
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Box
            sx={{
              px: 2,
              py: 2.25,
              borderRadius: 2.5,
              border: "1px dashed #D4E1D9",
              bgcolor: "#FAFCFB",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Chưa có tài liệu đính kèm.
            </Typography>
          </Box>
        )}
      </Box>

      {fileError && <Alert severity="warning">{fileError}</Alert>}
    </Stack>
  );
}
