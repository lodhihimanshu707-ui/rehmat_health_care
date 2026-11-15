import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-3xl font-bold text-slate-900">Page Not Found</h2>
      <p className="mt-2 text-sm text-slate-600">
        The requested page does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
