"use client";

export function Marquee({
  items,
  className = "",
  speed = 30,
}: {
  items: string[];
  className?: string;
  speed?: number;
}) {
  return (
    <div className={`marquee-container ${className}`}>
      <div
        className="marquee-content"
        style={{ animationDuration: `${speed}s` }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 px-8 text-sm text-text-secondary whitespace-nowrap"
          >
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
          </span>
        ))}
      </div>
    </div>
  );
}
