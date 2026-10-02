import { cn } from "../utils/utils";

export const Skeleton = ({ className }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={cn("block animate-pulse rounded bg-stroke dark:bg-meta-4", className)}
  />
);
