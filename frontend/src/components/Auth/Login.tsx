
import { useForm } from "react-hook-form";
import API from "../../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginFormData
{
  email: string;
  password: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Login()
{
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ mode: "onChange" });

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) =>
  {
    try
    {
      // Backend sets httpOnly accessToken + refreshToken cookies automatically.
      // Response shape: { user: { _id, name, email, role } }
      const res = await API.post("/auth/login", data);
      console.log(res);

      setUser(res.data.user);

      toast.success("Login successful!");

      // Redirect based on role
      if (res.data.user.role === "seller")
      {
        navigate("/seller/dashboard");
      } else
      {
        navigate("/");
      }
    } catch (err: any)
    {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 401)
      {
        toast.error("Invalid email or password");
      } else
      {
        toast.error(message || "Login failed. Please try again.");
      }
    }
  };

  // ── Shared class helpers ───────────────────────────────────────────────────

  const inputBase =
    "pl-10 w-full px-4 py-2 rounded-lg focus:outline-none border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 dark:bg-gray-800 transition";

  const inputNormal = `${inputBase} border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400`;
  const inputError = `${inputBase} border-red-500 focus:ring-2 focus:ring-red-400 dark:border-red-500`;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-6 bg-white shadow-lg sm:p-8 dark:bg-gray-900 rounded-2xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-900 dark:text-white">
          Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* ── Email ─────────────────────────────────────────────────────── */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" />
            <input
              type="email"
              placeholder="Email address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={errors.email ? inputError : inputNormal}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* ── Password ──────────────────────────────────────────────────── */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className={`pr-10 ${errors.password ? inputError : inputNormal}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* ── Submit ────────────────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 font-semibold text-white transition bg-black rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-black dark:text-white hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}