"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  School,
  Upload,
  CheckCircle2,
  AlertCircle,
  Home,
} from "lucide-react";
import Link from "next/link";

export default function AddSchool() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return setImagePreview(null);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e) => {
    const url = e.target.value.trim();
    setImagePreview(url || null);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setStatus(null);
    try {
      const payload = {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        contact: data.contact,
        email_id: data.email_id,
        image: null,
      };

      // file upload priority
      if (data.image?.length) {
        const file = data.image[0];
        const base64 = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.onerror = rej;
          r.readAsDataURL(file);
        });
        payload.image = base64;
      } else if (data.imageUrl) {
        payload.image = data.imageUrl.trim();
      }

      const res = await fetch("/api/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setStatus({ type: "success", message: "School added successfully!" });
        reset();
        setImagePreview(null);
        setTimeout(() => setStatus(null), 4500);
      } else {
        setStatus({
          type: "error",
          message: json.error || "Failed to add school.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Network error. Try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden p-6">
      {/* background blobs */}
      <div className="absolute -top-20 -left-16 w-[28rem] h-[28rem] rounded-full bg-blue-400/30 blob pointer-events-none" />
      <div className="absolute -bottom-24 -right-10 w-[30rem] h-[30rem] rounded-full bg-pink-400/25 blob blob-2 pointer-events-none" />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 16 }}
        className="relative z-10 w-full max-w-2xl rounded-3xl glass px-8 py-10"
        aria-labelledby="add-school-title"
      >
        {/* ✅ Home button styled same as ShowSchools */}
        <Link
          href="/"
          className="absolute top-5 left-6 flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 text-sm font-semibold transition"
        >
          <Home className="w-4 h-4" /> Home
        </Link>

        <div className="text-center mb-6">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-fuchsia-500 grid place-items-center shadow-lg">
            <School className="w-7 h-7 text-white" />
          </div>
          <h1 id="add-school-title" className="display text-3xl md:text-4xl">
            Add New School
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Fill in the details to register a school
          </p>
        </div>

        {/* status messages */}
        {status && (
          <div
            role="status"
            aria-live="polite"
            className={`mb-5 rounded-xl px-4 py-3 border ${
              status.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="inline w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="inline w-5 h-5 mr-2" />
            )}
            <span className="font-medium">{status.message}</span>
          </div>
        )}

        {/* form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* name */}
          <div className="floating">
            <input
              {...register("name", {
                required: "School name is required",
                minLength: { value: 2, message: "Min 2 chars" },
              })}
              placeholder=" "
              aria-invalid={errors.name ? "true" : "false"}
              className={`w-full rounded-xl px-4 py-3 ${
                errors.name ? "border-red-400" : ""
              }`}
            />
            <label>School Name *</label>
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* address */}
          <div className="floating">
            <textarea
              {...register("address", {
                required: "Address required",
                minLength: { value: 8, message: "Please enter full address" },
              })}
              placeholder=" "
              rows={4}
              aria-invalid={errors.address ? "true" : "false"}
              className={`w-full rounded-xl px-4 py-3 ${
                errors.address ? "border-red-400" : ""
              }`}
            />
            <label>Address *</label>
            {errors.address && (
              <p className="mt-1 text-xs text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* city + state */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="floating">
              <input
                {...register("city", { required: "City required" })}
                placeholder=" "
                className="w-full rounded-xl px-4 py-3"
              />
              <label>City *</label>
            </div>
            <div className="floating">
              <input
                {...register("state", { required: "State required" })}
                placeholder=" "
                className="w-full rounded-xl px-4 py-3"
              />
              <label>State *</label>
            </div>
          </div>

          {/* contact + email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="floating">
              <input
                {...register("contact", {
                  required: "Contact required",
                  pattern: {
                    value: /^[0-9]{7,15}$/,
                    message: "Enter valid phone",
                  },
                })}
                placeholder=" "
                className="w-full rounded-xl px-4 py-3"
              />
              <label>Contact Number *</label>
              {errors.contact && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.contact.message}
                </p>
              )}
            </div>
            <div className="floating">
              <input
                {...register("email_id", {
                  required: "Email required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email",
                  },
                })}
                placeholder=" "
                className="w-full rounded-xl px-4 py-3"
              />
              <label>Email Address *</label>
              {errors.email_id && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email_id.message}
                </p>
              )}
            </div>
          </div>

          {/* image upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              School Image (optional)
            </label>
            <label className="flex cursor-pointer items-center justify-center w-full h-36 rounded-2xl border border-dashed border-slate-300 bg-white/60 hover:bg-white/70 transition">
              <div className="flex flex-col items-center">
                <Upload className="w-6 h-6 text-slate-500 mb-1" />
                <span className="text-sm text-slate-600">
                  Click to upload (PNG/JPG up to 10MB)
                </span>
              </div>
              <input
                {...register("image")}
                onChange={(e) => {
                  handleImageChange(e);
                  register("image").onChange?.(e);
                }}
                className="hidden"
                type="file"
                accept="image/*"
              />
            </label>
          </div>

          {/* image url */}
          <div className="floating">
            <input
              {...register("imageUrl")}
              placeholder=" "
              className="w-full rounded-xl px-4 py-3"
              onChange={handleUrlChange}
            />
            <label>Image URL (optional)</label>
          </div>

          {/* preview */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="mt-3 h-28 rounded-xl border shadow-md object-contain"
            />
          )}

          {/* submit */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            className="btn-gradient w-full py-4 px-6 text-lg font-semibold"
          >
            {isLoading ? "Adding School…" : "Add School"}
          </motion.button>

          <p className="text-center text-sm text-slate-600">
            or{" "}
            <Link
              href="/showSchools"
              className="underline decoration-indigo-400"
            >
              View all schools →
            </Link>
          </p>
        </form>
      </motion.section>
    </main>
  );
}
