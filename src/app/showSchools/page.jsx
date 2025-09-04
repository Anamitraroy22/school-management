"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  School,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Loader2,
  Home,
  Search,
} from "lucide-react";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchSchools = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/schools");
      const json = await res.json();
      if (res.ok && json.success) {
        const list = Array.isArray(json.schools ?? json.data)
          ? (json.schools ?? json.data)
          : [];
        setSchools(list);
      } else {
        setError(json.error || "Failed to fetch schools");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Unable to load schools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return schools;
    return schools.filter((s) =>
      [s.name, s.city, s.state, s.address]
        .map((v) => String(v || "").toLowerCase())
        .some((v) => v.includes(q))
    );
  }, [schools, query]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this school?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/schools/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        await fetchSchools();
      } else {
        alert(json.error || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div className="glass p-8 rounded-2xl w-full max-w-3xl text-center">
          <Loader2 className="w-10 h-10 mx-auto animate-spin text-indigo-500 mb-4" />
          <p className="font-medium">Loading schools…</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div className="glass p-8 rounded-2xl max-w-3xl text-center text-red-700">
          <p className="font-semibold mb-2">Oops — something went wrong</p>
          <p className="text-sm mb-4">{error}</p>
          <button onClick={fetchSchools} className="btn-ghost">
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-4 py-12">
      <a href="#main" className="skip-link">Skip to content</a>

      {/* subtle background blobs */}
      <div className="absolute -top-24 -left-12 w-[28rem] h-[28rem] rounded-full bg-indigo-400/20 blob pointer-events-none" />
      <div className="absolute bottom-[-6rem] right-[-6rem] w-[30rem] h-[30rem] rounded-full bg-fuchsia-400/18 blob blob-2 pointer-events-none" />

      <div id="main" className="relative z-10 max-w-7xl mx-auto">
        {/* header + controls */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
              aria-label="Go to homepage"
            >
              <Home className="w-4 h-4" /> Home
            </Link>
            <div className="ml-2">
              <h1 className="display text-2xl md:text-3xl mb-0.5">All Registered Schools</h1>
              <p className="text-sm text-slate-600">Browse, edit or remove entries</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-[min(520px,56vw)]">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" aria-hidden />
              <input
                role="search"
                aria-label="Search schools"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, city, state..."
                className="w-full rounded-full border border-white/60 bg-white/70 pl-9 pr-4 py-2 shadow focus:focus-gradient"
              />
            </div>

            <Link
              href="/addschool"
              className="btn-gradient px-4 py-2 text-sm font-semibold"
              aria-label="Add new school"
            >
              Add School
            </Link>
          </div>
        </div>

        {/* empty state */}
        {filtered.length === 0 ? (
          <section className="glass rounded-3xl p-10 text-center" aria-live="polite">
            <p className="text-slate-700 mb-4">No schools found{query ? " for your search." : "."}</p>
            <Link href="/addschool" className="btn-gradient inline-block px-6 py-3 font-semibold">
              Add the first school →
            </Link>
          </section>
        ) : (
          <section aria-label="Schools list" className="grid-cards">
            {filtered.map((s) => (
              <article key={s.id} className="card" aria-labelledby={`school-${s.id}-title`}>
                {/* image area */}
                {s.image ? (
                  <img
                    src={s.image}
                    alt={s.name || "School image"}
                    className="card-img"
                    loading="lazy"
                    fetchPriority="low"
                  />
                ) : (
                  <div className="card-img grid place-items-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500">
                    <School className="w-12 h-12" />
                  </div>
                )}

                <div className="p-5">
                  {/* school name in bold */}
                  <h3 id={`school-${s.id}-title`} className="text-lg font-bold mb-2">
                    {s.name}
                  </h3>

                  <div className="text-sm text-slate-600 space-y-2 mb-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-indigo-500 mt-0.5" />
                      <span>{s.address}, {s.city}, {s.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-indigo-500" />
                      <span>{s.contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-500" />
                      <span className="truncate">{s.email_id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/editSchool/${s.id}`}
                      className="flex-1 rounded-xl bg-amber-300 hover:bg-amber-400 px-4 py-2 text-center font-semibold transition"
                      aria-label={`Edit ${s.name}`}
                    >
                      <div className="inline-flex items-center gap-2">
                        <Edit className="w-4 h-4" /> Edit
                      </div>
                    </Link>

                    <button
                      onClick={() => handleDelete(s.id)}
                      disabled={deletingId === s.id}
                      className="flex-1 rounded-xl bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 font-semibold transition"
                      aria-label={`Delete ${s.name}`}
                    >
                      <div className="inline-flex items-center gap-2">
                        {deletingId === s.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        <span>{deletingId === s.id ? "Deleting…" : "Delete"}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
