"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  if (status === "loading") {
    return (
      <div className="max-w-[1120px] mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (newPassword !== confirmPassword) {
      setPwError("New passwords don't match.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data.error || "Failed to change password");
      } else {
        setPwSuccess("Password changed. Please sign in again.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Sign out to invalidate other sessions
        setTimeout(() => {
          signOut({ callbackUrl: "/login" });
        }, 2000);
      }
    } catch {
      setPwError("Something went wrong.");
    }
    setPwLoading(false);
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== "DELETE") return;
    setDeleteLoading(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "DELETE" }),
      });
      if (res.ok) {
        signOut({ callbackUrl: "/login" });
      } else {
        setDeleteError("Failed to delete account.");
        setDeleteLoading(false);
      }
    } catch {
      setDeleteError("Something went wrong.");
      setDeleteLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/login");
  }

  return (
    <div className="max-w-[1120px] mx-auto px-4 py-8">
      <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">Account</h1>

      {/* Profile card */}
      <Card className="p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <p className="text-sm text-gray-900">{session?.user?.email}</p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Change password</h3>
            <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Current password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand/30 focus:border-sky-brand"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">New password</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand/30 focus:border-sky-brand"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Confirm new password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand/30 focus:border-sky-brand"
                  autoComplete="new-password"
                />
              </div>

              {pwError && (
                <p className="text-xs text-red-600">{pwError}</p>
              )}
              {pwSuccess && (
                <p className="text-xs text-emerald-600">{pwSuccess}</p>
              )}

              <Button
                type="submit"
                size="sm"
                disabled={!currentPassword || !newPassword || !confirmPassword}
                loading={pwLoading}
              >
                Change password
              </Button>
            </form>
          </div>
        </div>
      </Card>

      {/* Sign out card */}
      <Card className="p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-900 mb-3">Sign out everywhere</h2>
        <p className="text-xs text-gray-500 mb-4">
          This will end your current session and any other active sessions.
        </p>
        <Button variant="ghost" onClick={handleSignOut}>
          Sign out
        </Button>
      </Card>

      {/* Delete account card */}
      <Card className="p-6 border-red-100">
        <h2 className="text-sm font-medium text-red-600 mb-3">Delete account</h2>
        <p className="text-xs text-gray-500 mb-4">
          This action is irreversible. All your orders, files, and data will be permanently deleted.
        </p>

        {!showDeleteConfirm ? (
          <Button
            variant="ghost"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete account
          </Button>
        ) : (
          <div className="space-y-3 max-w-sm">
            <p className="text-xs text-gray-600">
              Type <span className="font-mono font-medium">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400"
              placeholder="DELETE"
            />
            {deleteError && (
              <p className="text-xs text-red-600">{deleteError}</p>
            )}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={deleteConfirmText !== "DELETE"}
                loading={deleteLoading}
                onClick={handleDeleteAccount}
              >
                Delete permanently
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
