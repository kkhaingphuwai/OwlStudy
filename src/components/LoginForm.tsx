import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import BackgroundIcon from "./BackgroundIcon";
import logo from '../assets/images/logo.png';

interface FormData {
  email: string;
  password: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (serverError) setServerError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err: any) {
      if (err instanceof Error) {
        setServerError(err.message || "Login failed");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 min-h-screen bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
      {/* --- Refined Animated Educational Background --- */}
      <div>
        <BackgroundIcon />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-10">
          {/* Increased container size and removed heavy padding */}
          <div className="inline-flex items-center justify-center w-50 h-28 transition-transform hover:scale-110 duration-300">
            <img
              src={logo}
              alt="Logo"
              className="object-contain"
            />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
            Welcome!
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Continue your learning journey
          </p>
        </div>

        {/* Login Card (Glassmorphism effect) */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {serverError && (
              <div className="bg-red-50/50 backdrop-blur-sm border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium animate-shake">
                {serverError}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-5 py-4 bg-gray-50/50 border-2 transition-all duration-200 outline-none rounded-2xl focus:bg-white ${errors.email
                  ? "border-red-400"
                  : "border-transparent focus:border-orange-400"
                  }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-5 py-4 bg-gray-50/50 border-2 transition-all duration-200 outline-none rounded-2xl focus:bg-white ${errors.password
                    ? "border-red-400"
                    : "border-transparent focus:border-orange-400"
                    }`}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {errors.password}
                  </p>
                )}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-orange-500 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 cursor-pointer w-full relative group overflow-hidden bg-gradient-to-br from-orange-500 to-rose-500 text-white py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 hover:shadow-orange-200 hover:-translate-y-1 active:scale-95 disabled:opacity-70"
              >
                <span className="relative z-10">
                  {loading ? "Signing in..." : "Sign In"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="mt-8 text-[10px] text-gray-400 uppercase tracking-[0.2em]">
            &copy; 2026 OwlStudy Academic &bull; All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
