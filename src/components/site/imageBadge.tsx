interface ImageBadgeProps {
  text: string;
}

export default function ImageBadge({ text }: ImageBadgeProps) {
  return (
    <span className="bg-site-primary text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-sm whitespace-nowrap shadow-md">
      {text}
    </span>
  );
}
