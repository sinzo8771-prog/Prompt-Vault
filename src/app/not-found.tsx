import Link from "next/link";

const interClass = "__variable_inter";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-32 px-6">
      <div className="text-center max-w-md">
        <p className="label mb-4">Error 404</p>
        <h1 className="display-2 mb-6">
          Page not <span className="text-accent">found</span>
        </h1>
        <p className="body-lg text-text-secondary mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
