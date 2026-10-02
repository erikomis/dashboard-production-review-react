import { cn } from "../utils/utils";

export const Skeleton = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <span
    aria-hidden="true"
    style={style}
    className={cn("block animate-pulse rounded bg-stroke dark:bg-meta-4", className)}
  />
);
