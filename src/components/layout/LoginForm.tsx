
"use client";

import { useEffect, useState, type FormEvent } from "react";
import NextLink from "@/components/shared/NextLink";
import { useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { createClient } from "@/lib/supabase/client";

type AuthMeResponse = {
  message?: string;
  profile?: {
    role?: "ADMIN" | "STAFF" | "MANAGER";
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

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Kiểm tra session Supabase khi truy cập trang đăng nhập.
  useEffect(() => {
    let cancelled = false;

    async function checkExistingSession() {
      let redirected = false;

      try {
        const supabase = createClient();

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        // Chưa đăng nhập thì tiếp tục hiển thị form.
        if (!session) return;

        // Có session, xác minh profile và quyền truy cập từ server.
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        const body: AuthMeResponse = await response.json();

        if (!response.ok || !body.profile?.role) {
          throw new Error(
            body.message || "Không thể xác minh quyền truy cập tài khoản.",
          );
        }

        const destination = body.profile.must_change_password
          ? "/change-password"
          : body.profile.role === "ADMIN"
            ? "/admin"
            : "/staff";

        if (!cancelled) {
          redirected = true;
          router.replace(destination);
          router.refresh();
        }
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Không thể kiểm tra phiên đăng nhập.",
          );
        }
      } finally {
        // Không hiện lại form trong lúc đang chuyển trang.
        if (!cancelled && !redirected) {
          setCheckingSession(false);
        }
      }
    }

    checkExistingSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (loginError) {
        throw new Error("Email hoặc mật khẩu không chính xác.");
      }

      const response = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      const body: AuthMeResponse = await response.json();

      if (!response.ok || !body.profile?.role) {
        throw new Error(
          body.message || "Tài khoản chưa được cấp quyền.",
        );
      }

      const destination = body.profile.must_change_password
        ? "/change-password"
        : body.profile.role === "ADMIN"
          ? "/admin"
          : "/staff";

      router.replace(destination);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể đăng nhập.",
      );
    } finally {
      setLoading(false);
    }
  }

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
      {/* Background decoration */}
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
          maxWidth: 460,
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

        <Stack spacing={0} sx={{ p: { xs: 2.5, sm: 4.5 } }}>
          {/* Header */}
          <Stack
            alignItems="center"
            spacing={1.5}
            sx={{ mb: { xs: 3, sm: 3.5 } }}
          >
            <Box
              sx={{
                width: 68,
                height: 68,
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                color: "#087C68",
                bgcolor: "#E5F3EC",
                border: "1px solid #D5EADF",
                boxShadow: "0 5px 16px rgba(20,112,82,.08)",
              }}
            >
              <LocalHospitalOutlinedIcon sx={{ fontSize: 38 }} />
            </Box>

            <Stack spacing={0.5} alignItems="center">
              <Typography
                variant="h5"
                fontWeight={900}
                color="#174C3D"
                textAlign="center"
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.45rem" },
                  lineHeight: 1.4,
                }}
              >
                Trạm Y tế xã Tuyên Sơn
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ lineHeight: 1.7 }}
              >
                Hệ thống quản lý và điều hành
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: "#EAF0EC", mb: 3 }} />

          {checkingSession ? (
            /* Session checking state */
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ py: { xs: 4, sm: 5 } }}
            >
              <CircularProgress
                size={34}
                thickness={4}
                sx={{ color: "#087C68" }}
              />

              <Typography
                fontWeight={700}
                color="#315C4B"
              >
                Đang kiểm tra phiên đăng nhập...
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Vui lòng đợi trong giây lát.
              </Typography>
            </Stack>
          ) : (
            <>
              {/* Form heading */}
              <Stack spacing={0.5} sx={{ mb: 2.5 }}>
                <Typography
                  variant="h6"
                  fontWeight={800}
                  color="#263D33"
                >
                  Đăng nhập
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  Vui lòng nhập thông tin tài khoản được cấp để tiếp tục.
                </Typography>
              </Stack>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2.25,
                    borderRadius: 2,
                    alignItems: "center",
                    "& .MuiAlert-message": {
                      fontSize: 13,
                      lineHeight: 1.6,
                    },
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={submit}>
                <Stack spacing={2}>
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="username"
                    placeholder="Nhập địa chỉ email"
                    required
                    fullWidth
                    size="small"
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutlineOutlinedIcon
                              sx={{ fontSize: 20, color: "#82958A" }}
                            />
                          </InputAdornment>
                        ),
                      },
                      htmlInput: {
                        inputMode: "email",
                      },
                    }}
                  />

                  <TextField
                    label="Mật khẩu"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu"
                    required
                    fullWidth
                    size="small"
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon
                              sx={{ fontSize: 20, color: "#82958A" }}
                            />
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
                      letterSpacing: 0.2,
                      textTransform: "none",
                      boxShadow: "0 5px 14px rgba(8,124,104,.2)",
                      background:
                        "linear-gradient(110deg, #087C68, #159477)",
                      "&:hover": {
                        background:
                          "linear-gradient(110deg, #066957, #108268)",
                        boxShadow: "0 7px 18px rgba(8,124,104,.25)",
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
                        <span>Đang đăng nhập...</span>
                      </Stack>
                    ) : (
                      "Đăng nhập"
                    )}
                  </Button>
                </Stack>
              </Box>

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
                  sx={{
                    display: "block",
                    textAlign: "center",
                    lineHeight: 1.8,
                  }}
                >
                  Tài khoản cán bộ do quản trị viên cấp. Khi quên mật khẩu,
                  vui lòng liên hệ quản trị viên để được cấp mật khẩu tạm.
                </Typography>
              </Box>

              <Button
                component={NextLink}
                href="/"
                fullWidth
                color="inherit"
                startIcon={<ArrowBackOutlinedIcon />}
                sx={{
                  mt: 2,
                  minHeight: 44,
                  borderRadius: 2.5,
                  color: "#537064",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#F1F6F2",
                    color: "#087C68",
                  },
                }}
              >
                Quay lại trang chủ
              </Button>
            </>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
