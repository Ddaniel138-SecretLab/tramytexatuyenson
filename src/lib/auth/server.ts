import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export type AuthContext = {
  user: User;
  profile: Profile;
};

export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile || !profile.is_active) return null;
  return { user, profile: profile as Profile };
}

export async function requireAdmin() {
  const context = await getAuthContext();
  if (!context) return { authorized: false as const, status: 401, message: "Bạn chưa đăng nhập hoặc tài khoản đã bị khóa." };
  if (context.profile.role !== "ADMIN") return { authorized: false as const, status: 403, message: "Bạn không có quyền quản trị." };
  return { authorized: true as const, ...context };
}

export async function requireStaff() {
  const context = await getAuthContext();
  if (!context) return { authorized: false as const, status: 401, message: "Bạn chưa đăng nhập hoặc tài khoản đã bị khóa." };
  if (context.profile.role !== "STAFF" && context.profile.role !== "MANAGER") return { authorized: false as const, status: 403, message: "Chức năng chỉ dành cho cán bộ." };
  if (context.profile.must_change_password) return { authorized: false as const, status: 428, message: "Bạn phải đổi mật khẩu trước khi tiếp tục." };
  return { authorized: true as const, ...context };
}
