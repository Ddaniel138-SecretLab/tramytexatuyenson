
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { createClient } from "@/lib/supabase/client";

type UserRole = "ADMIN" | "MANAGER" | "STAFF";

type AuthMeResponse = {
  message?: string;
  profile?: {
    role?: UserRole;
    must_change_password?: boolean;
  };
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 54,
    borderRadius: 2.5,
    bgcolor: "#FFFFFF",
    transition: "all .2s ease",
    "& fieldset": {
      borderColor: "#DCE7E1",
    },
    "&:hover fieldset": {
      borderColor: "#9ABBAA",
    },
    "&.Mui-focused fieldset": {
      borderWidth: 1.5,
    },
  },
  "& .MuiInputLabel-root": {
    color: "#64776D",
  },
};

const getDashboardPath = (role: UserRole) =>
  role === "ADMIN" ? "/admin" : "/staff";

export default function ChangePasswordForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [accessError, setAccessError] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [role, setRole] = useState<UserRole>("STAFF");

  // Kiểm tra đăng nhập và quyền đổi mật khẩu bắt buộc.
  useEffect(() => {
    let cancelled = false;
    let redirecting = false;

    async function checkAccess() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        const body = (await response.json().catch(() => null)) as
          | AuthMeResponse
          | null;

        // Chưa đăng nhập, tài khoản bị khóa hoặc không có profile hợp lệ.
        if (!response.ok || !body?.profile?.role) {
          redirecting = true;
          router.replace("/login");
          router.refresh();
          return;
        }

        const currentRole = body.profile.role;

        // Tài khoản không còn bị yêu cầu đổi mật khẩu.
        if (body.profile.must_change_password !== true) {
          redirecting = true;
          router.replace(getDashboardPath(currentRole));
          router.refresh();
          return;
        }

        if (!cancelled) {
          setRole(currentRole);
        }
      } catch {
        if (!cancelled) {
          setAccessError(
            "Không thể xác minh tài khoản. Vui lòng kiểm tra kết nối và thử lại.",
          );
        }
      } finally {
        // Giữ màn hình loading trong khi router chuyển trang.
        if (!cancelled && !redirecting) {
          setChecking(false);
        }
      }
    }

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 10) {
      setError("Mật khẩu mới phải có ít nhất 10 ký tự.");
      return;
    }

    if (password.length > 128) {
      setError("Mật khẩu mới không được vượt quá 128 ký tự.");
      return;
    }

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: password,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body.message || "Không thể đổi mật khẩu.",
        );
      }

      // Làm mới session sau khi đổi mật khẩu thành công.
      const supabase = createClient();
      const { error: refreshError } =
        await supabase.auth.refreshSession();

      if (refreshError) {
        // Mật khẩu đã đổi ở server. Nếu không làm mới được session,
        // đăng xuất để người dùng đăng nhập lại bằng mật khẩu mới.
        await supabase.auth.signOut().catch(() => undefined);

        router.replace("/login");
        router.refresh();
        return;
      }

      setPassword("");
      setConfirm("");

      router.replace(getDashboardPath(role));
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Không thể đổi mật khẩu.",
      );
    } finally {
      setLoading(false);
    }
  }

  const pageContent = checking ? (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ py: 5 }}
    >
      <CircularProgress
        size={34}
        thickness={4}
        sx={{ color: "#087C68" }}
      />
      <Typography fontWeight={700} color="#315C4B">
        Đang xác minh tài khoản...
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
      >
        Vui lòng đợi trong giây lát.
      </Typography>
    </Stack>
  ) : accessError ? (
    <Stack spacing={2}>
      <Alert severity="error">{accessError}</Alert>
      <Button
        variant="contained"
        fullWidth
        onClick={() => window.location.reload()}
        sx={{ minHeight: 46, borderRadius: 2.5 }}
      >
        Thử lại
      </Button>
      <Button
        href="/login"
        fullWidth
        startIcon={<ArrowBackOutlinedIcon />}
        sx={{ minHeight: 44, textTransform: "none" }}
      >
        Quay lại đăng nhập
      </Button>
    </Stack>
  ) : (
    <>
      <Stack spacing={0.75} sx={{ mb: 2.5 }}>
        <Typography
          variant="h6"
          fontWeight={800}
          color="#263D33"
        >
          Thiết lập mật khẩu mới
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.7 }}
        >
          Tài khoản của bạn cần đặt mật khẩu mới trước khi tiếp tục làm việc.
        </Typography>
      </Stack>

      <Alert
        severity="info"
        sx={{
          mb: 2.25,
          borderRadius: 2,
          "& .MuiAlert-message": {
            fontSize: 13,
            lineHeight: 1.7,
          },
        }}
      >
        Mật khẩu mới phải có ít nhất 10 ký tự và không vượt quá 128 ký tự.
      </Alert>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2.25,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={submit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            required
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            sx={fieldSx}
            slotProps={{
              htmlInput: {
                minLength: 10,
                maxLength: 128,
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon
                      sx={{ fontSize: 20, color: "#82958A" }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label={
                        showPassword
                          ? "Ẩn mật khẩu"
                          : "Hiện mật khẩu"
                      }
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <VisibilityOutlinedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="Xác nhận mật khẩu mới"
            placeholder="Nhập lại mật khẩu mới"
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            autoComplete="new-password"
            sx={fieldSx}
            slotProps={{
              htmlInput: {
                minLength: 10,
                maxLength: 128,
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon
                      sx={{ fontSize: 20, color: "#82958A" }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label={
                        showConfirm
                          ? "Ẩn mật khẩu xác nhận"
                          : "Hiện mật khẩu xác nhận"
                      }
                      onClick={() =>
                        setShowConfirm((value) => !value)
                      }
                    >
                      {showConfirm ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <VisibilityOutlinedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              minHeight: 50,
              mt: 0.5,
              borderRadius: 2.5,
              fontSize: 15,
              fontWeight: 800,
              textTransform: "none",
              boxShadow: "0 5px 14px rgba(8,124,104,.2)",
              background:
                "linear-gradient(110deg, #087C68, #159477)",
              "&:hover": {
                background:
                  "linear-gradient(110deg, #066957, #108268)",
              },
              "&.Mui-disabled": {
                color: "#FFFFFF",
                bgcolor: "#8DB9AA",
              },
            }}
          >
            {loading ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.25}
              >
                <CircularProgress size={19} color="inherit" />
                <span>Đang cập nhật mật khẩu...</span>
              </Stack>
            ) : (
              "Xác nhận đổi mật khẩu"
            )}
          </Button>
        </Stack>
      </Box>
    </>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 5 },
        bgcolor: "#F3F8F5",
        background:
          "radial-gradient(circle at 12% 12%, rgba(30,139,105,.10), transparent 30%), radial-gradient(circle at 90% 85%, rgba(36,155,123,.09), transparent 28%), linear-gradient(135deg, #EAF4EF 0%, #F7FAF8 52%, #EAF3EF 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          border: "1px solid rgba(31,121,91,.08)",
          top: -200,
          right: { xs: -180, sm: -100 },
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 440,
          height: 440,
          borderRadius: "50%",
          border: "1px solid rgba(31,121,91,.07)",
          bottom: -300,
          left: { xs: -250, sm: -160 },
          pointerEvents: "none",
        }}
      />

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 480,
          borderRadius: { xs: 3, sm: 4 },
          border: "1px solid rgba(221,235,226,.9)",
          bgcolor: "rgba(255,255,255,.96)",
          boxShadow: "0 16px 55px rgba(32,82,61,.09)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: 5,
            background:
              "linear-gradient(90deg, #087C68, #32A77D, #9ACDAB)",
          }}
        />

        <Stack
          sx={{
            p: { xs: 2.5, sm: 4 },
          }}
        >
          <Stack
            alignItems="center"
            spacing={1.5}
            sx={{ mb: 3 }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                color: "#087C68",
                bgcolor: "#E5F3EC",
                border: "1px solid #D5EADF",
                boxShadow: "0 5px 16px rgba(20,112,82,.08)",
              }}
            >
              <LocalHospitalOutlinedIcon sx={{ fontSize: 36 }} />
            </Box>

            <Stack spacing={0.5} alignItems="center">
              <Typography
                variant="h5"
                fontWeight={900}
                color="#174C3D"
                textAlign="center"
                sx={{
                  fontSize: {
                    xs: "1.2rem",
                    sm: "1.4rem",
                  },
                  lineHeight: 1.4,
                }}
              >
                Trạm Y tế xã Tuyên Sơn
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Thiết lập bảo mật tài khoản
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: "#EAF0EC", mb: 3 }} />

          {checking || accessError ? (
            pageContent
          ) : (
            <>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  mb: 2,
                  borderRadius: 2.5,
                  display: "grid",
                  placeItems: "center",
                  color: "#087C68",
                  bgcolor: "#E5F3EC",
                }}
              >
                <LockResetOutlinedIcon sx={{ fontSize: 27 }} />
              </Box>

              {pageContent}

              <Box
                sx={{
                  mt: 2.5,
                  p: 1.75,
                  borderRadius: 2.5,
                  bgcolor: "#F4F8F5",
                  border: "1px solid #E8F0EA",
                }}
              >
                <Typography
                  variant="caption"
                  color="#60746A"
                  textAlign="center"
                  display="block"
                  sx={{ lineHeight: 1.8 }}
                >
                  Sau khi đổi mật khẩu thành công, bạn sẽ được chuyển
                  đến khu vực làm việc tương ứng với tài khoản.
                </Typography>
              </Box>
            </>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
