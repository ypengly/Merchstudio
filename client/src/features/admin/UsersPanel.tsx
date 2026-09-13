import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { AdminUser } from "@/types";

export default function UsersPanel() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get<AdminUser[]>("/admin/users").then(setUsers).finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h2 className="font-display text-xl font-semibold">Users</h2>
      {isLoading ? (
        <p className="mt-6 text-steel text-sm">Loading…</p>
      ) : (
        <div className="mt-6 border border-line rounded-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-panel text-steel text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Plan</th>
                <th className="text-left px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.name ?? "—"}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">{u.subscription?.plan ?? "FREE"}</td>
                  <td className="px-4 py-3 text-steel">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
