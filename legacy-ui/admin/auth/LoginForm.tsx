
"use client";

import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(
          "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.",
        );
        return;
      }

      setSuccessMessage(
        "Đăng nhập thành công. Phiên đăng nhập đã được tạo.",
      );

      // Refresh server-rendered content with the new session.
      window.location.reload();
    } catch {
      setErrorMessage("Không thể kết nối hệ thống. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ variant: "h5", fontWeight: 700 }}>
              Trạm Y tế xã Tuyên Sơn
            </Typography>

            <Typography sx={{ color: "text.secondary", mt: 1 }}>
              Đăng nhập hệ thống quản trị
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error">{errorMessage}</Alert>
          )}

          {successMessage && (
            <Alert severity="success">{successMessage}</Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                fullWidth
                autoComplete="username"
                autoFocus
              />

              <TextField
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                fullWidth
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Stack>
          </Box>

          <Typography
          
            sx={{ variant: "caption", color: "text.secondary", textAlign: "center" }}
          >
            Chỉ tài khoản được cấp quyền mới có thể đăng nhập.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
