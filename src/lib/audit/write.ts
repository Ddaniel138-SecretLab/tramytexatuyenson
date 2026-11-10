import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";

export async function writeAuditLog(
  admin: SupabaseClient,
  actor: { user: User; profile: Profile },
  input: {
    entityType: string; entityId?: string | null; targetUserId?: string | null;
    action: string; oldValues?: unknown; newValues?: unknown; metadata?: unknown;
  },
) {
  const { error } = await admin.from("audit_logs").insert({
    actor_id: actor.user.id,
    actor_name: actor.profile.full_name,
    actor_email: actor.user.email ?? null,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    target_user_id: input.targetUserId ?? null,
    action: input.action,
    old_values: input.oldValues ?? null,
    new_values: input.newValues ?? null,
    metadata: input.metadata ?? {},
  });
  if (error) console.error("Audit log write failed:", error.message);
}
