'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password validation rules
  const passwordErrors = () => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/\d/.test(password)) errors.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push('One special character');
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordErrors().length > 0) {
      setError('Password does not meet requirements');
      return;
    }

    try {
      setLoading(true);
      await signup({ name, email, password });
      router.push('/'); // or /login if you prefer
    } catch (err: any) {
      setError(err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const pwdErrors = passwordErrors();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-100 p-8">
        <h1 className="text-3xl font-serif text-center mb-6">
          Create Account
        </h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
            className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* PASSWORD RULES (only when focused + invalid) */}
            {passwordFocused && pwdErrors.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-[11px] text-stone-600 shadow">
                <p className="font-semibold mb-1">Password must include:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  {pwdErrors.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            placeholder="Confirm password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 text-white py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Already have an account?{' '}
          <span
            onClick={() => router.push('/login')}
            className="text-orange-600 font-bold cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
