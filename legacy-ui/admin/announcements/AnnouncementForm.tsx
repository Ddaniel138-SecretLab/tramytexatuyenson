/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AnnouncementPreviewDialog from "./AnnouncementPreviewDialog"

import AnnouncementImagePicker from "./AnnouncementImagePicker";
import AnnouncementAttachmentPicker from "./AnnouncementAttachmentPicker";

interface AnnouncementFormProps {
    mode: "create" | "edit";
    announcementId?: string;
}

interface FormData {
    title: string;
    slug: string;
    category: string;
    summary: string;
    content: string;
    status: "draft" | "published";
}

const initialForm: FormData = {
    title: "",
    slug: "",
    category: "announcement",
    summary: "",
    content: "",
    status: "draft",
};

export default function AnnouncementForm({
    mode,
    announcementId,
}: AnnouncementFormProps) {
    const isEdit = mode === "edit";

    const [form, setForm] = useState<FormData>(initialForm);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState("");

    useEffect(() => {
        if (!thumbnail) {
            setPreviewImageUrl("");
            return;
        }

        const objectUrl = URL.createObjectURL(thumbnail);
        setPreviewImageUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [thumbnail]);

    const updateField = (field: keyof FormData, value: string) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const generateSlug = (value: string) => {
        return value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "d")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleTitleChange = (value: string) => {
        setForm((previous) => ({
            ...previous,
            title: value,
            slug: generateSlug(value),
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");
        setNotice("");

        if (!form.title.trim()) {
            setError("Vui lòng nhập tiêu đề thông báo.");
            return;
        }

        if (!form.slug.trim()) {
            setError("Vui lòng nhập slug.");
            return;
        }

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
            setError("Slug không hợp lệ. Chỉ dùng chữ thường, số và dấu gạch ngang.");
            return;
        }

        if (!form.summary.trim()) {
            setError("Vui lòng nhập mô tả ngắn.");
            return;
        }

        if (!form.content.trim()) {
            setError("Vui lòng nhập nội dung thông báo.");
            return;
        }

        const submitter = (event.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement | null;

        const status =
            submitter?.value === "published" ? "published" : "draft";

        // TODO: Kết nối API tạo/cập nhật thông báo và upload Storage.
        // Không ghi nội dung hoặc file nhạy cảm vào audit log.
        console.log("Announcement form:", {
            ...form,
            status,
            thumbnail,
            attachments,
            announcementId,
        });

        setNotice(
            "Giao diện hiện chưa kết nối API. Thông báo và các file chưa được lưu.",
        );
    };

    return (
        <>
            <Stack spacing={3}>
                {/* Heading */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: { xs: "stretch", sm: "center" },
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: { xs: 22, sm: 26 },
                                fontWeight: 800,
                            }}
                        >
                            {isEdit ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
                        </Typography>

                        <Typography
                            sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}
                        >
                            Quản lý nội dung, hình ảnh và tài liệu đính kèm.
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        href="/admin/announcements"
                        variant="outlined"
                        startIcon={<ArrowBackOutlinedIcon />}
                        sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
                    >
                        Quay lại
                    </Button>
                </Stack>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2.5}>
                        {/* Main content */}
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Stack spacing={2.5}>
                                <Card
                                    sx={{
                                        border: "1px solid",
                                        borderColor: "divider",
                                        boxShadow: "none",
                                    }}
                                >
                                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                        <Typography sx={{ fontWeight: 700 }}>
                                            Nội dung thông báo
                                        </Typography>

                                        <Stack spacing={2.5} sx={{ mt: 2.5 }}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Tiêu đề"
                                                placeholder="Nhập tiêu đề thông báo..."
                                                value={form.title}
                                                onChange={(event) =>
                                                    handleTitleChange(event.target.value)
                                                }
                                            />

                                            <TextField
                                                fullWidth
                                                required
                                                label="Slug"
                                                value={form.slug}
                                                onChange={(event) =>
                                                    updateField("slug", event.target.value.toLowerCase())
                                                }
                                                helperText="Đường dẫn định danh thông báo. Có thể chỉnh sửa sau khi tự động tạo."
                                            />

                                            <TextField
                                                fullWidth
                                                select
                                                required
                                                label="Danh mục"
                                                value={form.category}
                                                onChange={(event) =>
                                                    updateField("category", event.target.value)
                                                }
                                            >
                                                <MenuItem value="announcement">Thông báo</MenuItem>
                                                <MenuItem value="news">Tin tức</MenuItem>
                                                <MenuItem value="health">Hoạt động y tế</MenuItem>
                                            </TextField>

                                            <TextField
                                                fullWidth
                                                required
                                                multiline
                                                minRows={3}
                                                label="Mô tả ngắn"
                                                placeholder="Tóm tắt nội dung thông báo..."
                                                value={form.summary}
                                                onChange={(event) =>
                                                    updateField("summary", event.target.value)
                                                }
                                            />

                                            <TextField
                                                fullWidth
                                                required
                                                multiline
                                                minRows={12}
                                                label="Nội dung chi tiết"
                                                placeholder="Nhập nội dung thông báo..."
                                                value={form.content}
                                                onChange={(event) =>
                                                    updateField("content", event.target.value)
                                                }
                                                helperText="Phiên bản giao diện hiện dùng trình soạn thảo văn bản cơ bản. Có thể thay bằng rich text editor sau."
                                            />
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* Thumbnail */}
                                <Card
                                    sx={{
                                        border: "1px solid",
                                        borderColor: "divider",
                                        boxShadow: "none",
                                    }}
                                >
                                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                        <AnnouncementImagePicker
                                            file={thumbnail}
                                            onChange={setThumbnail}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Attachments */}
                                <Card
                                    sx={{
                                        border: "1px solid",
                                        borderColor: "divider",
                                        boxShadow: "none",
                                    }}
                                >
                                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                        <AnnouncementAttachmentPicker
                                            files={attachments}
                                            onChange={setAttachments}
                                        />
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>

                        {/* Settings */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Stack spacing={2.5}>
                                <Card
                                    sx={{
                                        border: "1px solid",
                                        borderColor: "divider",
                                        boxShadow: "none",
                                    }}
                                >
                                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                        <Typography sx={{ fontWeight: 700 }}>
                                            Xuất bản
                                        </Typography>

                                        <Stack spacing={2} sx={{ mt: 2 }}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Trạng thái"
                                                value={form.status}
                                                onChange={(event) =>
                                                    updateField("status", event.target.value)
                                                }
                                            >
                                                <MenuItem value="draft">Bản nháp</MenuItem>
                                                <MenuItem value="published">Xuất bản</MenuItem>
                                            </TextField>

                                            <Alert severity="info">
                                                Bản nháp không hiển thị trên website công khai. Thông báo
                                                xuất bản sẽ được hiển thị theo trạng thái và thời gian
                                                đăng do hệ thống xử lý.
                                            </Alert>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                <Card
                                    sx={{
                                        border: "1px solid",
                                        borderColor: "divider",
                                        boxShadow: "none",
                                    }}
                                >
                                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                        <Typography sx={{ fontWeight: 700 }}>
                                            Phạm vi hiển thị
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontSize: 13,
                                                color: "text.secondary",
                                                lineHeight: 1.7,
                                            }}
                                        >
                                            Thông báo hiện được thiết kế để hiển thị công khai trên
                                            website. Việc chọn cơ sở áp dụng sẽ bổ sung sau khi xác
                                            nhận cấu trúc dữ liệu và API.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Feedback */}
                    {(error || notice) && (
                        <Alert severity={error ? "error" : "info"} sx={{ mt: 2.5 }}>
                            {error || notice}
                        </Alert>
                    )}

                    {/* Actions */}
                    <Stack
                        direction={{ xs: "column-reverse", sm: "row" }}
                        spacing={1.5}
                        sx={{ mt: 2.5, justifyContent: "flex-end" }}
                    >
                        <Button
                            component={Link}
                            href="/admin/announcements"
                            variant="outlined"
                            color="inherit"
                        >
                            Hủy
                        </Button>

                        <Button
                            type="button"
                            variant="outlined"
                            color="inherit"
                            startIcon={<VisibilityOutlinedIcon />}
                            onClick={() => setPreviewOpen(true)}
                        >
                            Xem trước
                        </Button>

                        <Button
                            type="submit"
                            name="status"
                            value="draft"
                            variant="outlined"
                            startIcon={<SaveOutlinedIcon />}
                        >
                            Lưu bản nháp
                        </Button>

                        <Button
                            type="submit"
                            name="status"
                            value="published"
                            variant="contained"
                            startIcon={<SendOutlinedIcon />}
                        >
                            Xuất bản
                        </Button>
                    </Stack>
                </Box>
            </Stack>

            <AnnouncementPreviewDialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                title={form.title}
                category={form.category}
                summary={form.summary}
                content={form.content}
                imageUrl={previewImageUrl}
            />
        </>
    );
}