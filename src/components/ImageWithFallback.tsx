import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  caption?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  eager = false,
  caption,
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EBE8E2] border border-[#D8C8B4] text-[#454843] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          className="mb-3 text-[#725B2F]"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" />
          <path d="M3 16l5-5 4 4 3-3 6 6" />
        </svg>
        <p className="font-serif text-sm text-[#252824]">{caption || alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
