"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

export default function AccountPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError("");
    setProfileSuccess("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setProfileError(data.error || "Failed to update");
      } else {
        setProfileSuccess("Profile updated.");
        await update({ name });
      }
    } catch {
      setProfileError("Something went wrong.");
    }
    setSavingProfile(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match.");
      setSavingPassword(false);
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      setSavingPassword(false);
      return;
    }
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        setPasswordError(data.error || "Failed to change password");
      } else {
        setPasswordSuccess("Password changed.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordError("Something went wrong.");
    }
    setSavingPassword(false);
  }

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account</h1>

      <Card className="mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Profile</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Field
            label="Email"
            type="email"
            value={session?.user?.email || ""}
            disabled
            helperText="Email cannot be changed"
          />
          <Field
            label="Display name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {profileError && <p className="text-sm text-red-500">{profileError}</p>}
          {profileSuccess && <p className="text-sm text-emerald-600">{profileSuccess}</p>}
          <Button type="submit" loading={savingProfile}>Save changes</Button>
        </form>
      </Card>

      <Card className="mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Change password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Field
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Field
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          <Field
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-emerald-600">{passwordSuccess}</p>}
          <Button type="submit" loading={savingPassword} variant="secondary">
            Change password
          </Button>
        </form>
      </Card>

      <Button variant="ghost" onClick={handleSignOut} className="text-red-600 hover:text-red-700 hover:bg-red-50">
        Sign out
      </Button>
    </div>
  );
}
