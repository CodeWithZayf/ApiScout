"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";

type Step = "signup" | "otp";

export default function SignupPage() {
    const { loginWithToken } = useAuth();
    const router = useRouter();

    // ── Step state ──────────────────────────────────────────────
    const [step, setStep] = useState<Step>("signup");

    // ── Signup form state ────────────────────────────────────────
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // ── OTP state ────────────────────────────────────────────────
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [resendCooldown, setResendCooldown] = useState(0);

    // ── Shared state ─────────────────────────────────────────────
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ── Step 1: Submit signup form → trigger OTP email ───────────
    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/initiate-signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password, name: name || undefined }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Could not send OTP");

            setStep("otp");
            startResendCooldown();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2: Verify OTP → create user → auto‑login ────────────
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const code = otp.join("");
        if (code.length < 6) {
            setError("Please enter the full 6-digit code");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, otp: code }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Invalid or expired OTP");

            // Use the token returned by verify-otp directly (no extra login call)
            loginWithToken(data.user, data.access_token);
            router.push("/");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    // ── Resend OTP ────────────────────────────────────────────────
    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setError("");

        try {
            const res = await fetch(`${API_BASE_URL}/auth/initiate-signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password, name: name || undefined }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Could not resend OTP");

            setOtp(["", "", "", "", "", ""]);
            otpRefs.current[0]?.focus();
            startResendCooldown();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Resend failed");
        }
    };

    const startResendCooldown = () => {
        setResendCooldown(60);
        const interval = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    // ── OTP input helpers ─────────────────────────────────────────
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // digits only
        const updated = [...otp];
        updated[index] = value.slice(-1); // one digit per box
        setOtp(updated);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
            otpRefs.current[5]?.focus();
        }
    };

    // ─────────────────────────────────────────────────────────────
    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">

                {/* ── STEP 1: Signup Form ──────────────────────────────── */}
                {step === "signup" && (
                    <>
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <Image src="/logo.png" alt="ApiScout Logo" width={48} height={48} className="mx-auto mb-4 rounded-2xl" />
                            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
                            <p className="mt-2 text-sm text-gray-500">
                                Join APIScout to bookmark, review, and submit APIs
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSignupSubmit} className="space-y-4">
                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="mb-1.5 block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="At least 6 characters"
                                        required
                                        minLength={6}
                                        className="w-full rounded-xl border bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                            >
                                {loading ? "Sending OTP..." : "Continue"}
                            </Button>
                        </form>

                        {/* Footer */}
                        <p className="mt-6 text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-orange-600 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </>
                )}

                {/* ── STEP 2: OTP Verification ─────────────────────────── */}
                {step === "otp" && (
                    <>
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/25">
                                <Mail className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
                            <p className="mt-2 text-sm text-gray-500">
                                We sent a 6-digit code to{" "}
                                <span className="font-medium text-gray-800">{email}</span>
                            </p>
                        </div>

                        {/* OTP Form */}
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            {/* 6 digit boxes */}
                            <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { otpRefs.current[i] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        className="h-14 w-12 rounded-xl border-2 bg-white text-center text-xl font-bold outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                    />
                                ))}
                            </div>

                            <Button
                                type="submit"
                                disabled={loading || otp.join("").length < 6}
                                className="w-full rounded-xl bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                            >
                                {loading ? "Verifying..." : "Verify & Create Account"}
                            </Button>
                        </form>

                        {/* Resend + back */}
                        <div className="mt-6 space-y-3 text-center text-sm text-gray-500">
                            <p>
                                Didn&apos;t receive the email?{" "}
                                <button
                                    onClick={handleResend}
                                    disabled={resendCooldown > 0}
                                    className="font-medium text-orange-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                                </button>
                            </p>
                            <p>
                                <button
                                    onClick={() => { setStep("signup"); setError(""); setOtp(["", "", "", "", "", ""]); }}
                                    className="text-gray-400 hover:text-gray-600 hover:underline"
                                >
                                    ← Back to signup
                                </button>
                            </p>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
