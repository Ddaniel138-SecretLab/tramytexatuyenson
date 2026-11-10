import Link from "next/link";

import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";

import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function RecentAnnouncements() {
    return (
        <Card
            sx={{
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "none",
            }}
        >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    sx={{
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        justifyContent: "space-between",
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 16,
                                fontWeight: 800,
                            }}
                        >
                            Thông báo gần đây
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 12,
                                color: "text.secondary",
                            }}
                        >
                            Theo dõi các nội dung đã được đăng tải
                        </Typography>
                    </Box>

                    <Link
                        href="/admin/announcements"
                        style={{ textDecoration: "none" }}
                    >
                        <Button
                            size="small"
                            endIcon={<ArrowForwardIcon />}
                        >
                            Xem tất cả
                        </Button>
                    </Link>
                </Stack>

                <Box
                    sx={{
                        py: { xs: 4, sm: 5 },
                        px: 2,
                        textAlign: "center",
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 2,
                    }}
                >
                    <CampaignOutlinedIcon
                        sx={{
                            fontSize: 40,
                            color: "text.disabled",
                        }}
                    />

                    <Typography
                        sx={{
                            mt: 1.5,
                            fontSize: 14,
                            fontWeight: 700,
                        }}
                    >
                        Chưa có dữ liệu thông báo
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: 12,
                            color: "text.secondary",
                        }}
                    >
                        Danh sách thông báo sẽ xuất hiện tại đây sau khi kết
                        nối API.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}