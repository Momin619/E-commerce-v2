import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import
{
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserTag,
} from "react-icons/fa";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "seller" | "customer";

interface SignupFormData
{
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Signup()
{
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({ mode: "onChange" });

  const onSubmit = async (data: SignupFormData) =>
  {
    try
    {
      const { confirmPassword, ...payload } = data; // strip confirmPassword

      // POST /api/auth/signup
      const res = await API.post("/auth/signup", payload);

      toast.success(res.data.message || "Account created! Please log in.");
      navigate("/login");
    } catch (err: any)
    {
      const message = err.response?.data?.message;

      if (message?.toLowerCase().includes("already exists"))
      {
        toast.error("An account with this email already exists.");
      } else
      {
        toast.error(message || "Signup failed. Please try again.");
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
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100 dark:bg-black">
      <div className="w-full max-w-md p-8 bg-white shadow-lg dark:bg-gray-900 rounded-2xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-900 dark:text-white">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* ── Full Name ─────────────────────────────────────────────────── */}
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Full Name"
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              className={errors.name ? inputError : inputNormal}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

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

          {/* ── Role ──────────────────────────────────────────────────────── */}
          <div className="relative">
            <FaUserTag className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" />
            <select
              {...register("role", { required: "Please select a role" })}
              defaultValue=""
              className={`${errors.role ? inputError : inputNormal} appearance-none cursor-pointer`}
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="customer">Customer – I want to shop</option>
              <option value="seller">Seller – I want to sell</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* ── Password ──────────────────────────────────────────────────── */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
                  message:
                    "Must include uppercase, lowercase, number & special character",
                },
              })}
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

          {/* ── Confirm Password ──────────────────────────────────────────── */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className={`pr-10 ${errors.confirmPassword ? inputError : inputNormal}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* ── Submit ────────────────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 font-semibold text-white transition bg-black rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-black dark:text-white hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}