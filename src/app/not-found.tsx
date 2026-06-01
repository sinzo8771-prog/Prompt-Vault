import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-32">
      <div className="text-center">
        <p className="text-8xl font-bold text-text-muted/20 mb-4">404</p>
        <h1 className="text-2xl font-bold text-text mb-3">Page not found</h1>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-magnetic">
          <span>Go Home →</span>
        </Link>
      </div>
    </div>
  );
}
