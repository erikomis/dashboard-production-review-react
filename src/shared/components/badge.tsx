import { tv } from "tailwind-variants";
import { cn } from "../utils/utils";

const badgeVariants = tv({
  base: "inline-flex max-w-full items-center gap-1 truncate rounded-full px-2.5 py-0.5 text-xs font-medium",
  variants: {
    color: {
      primary: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light",
      success: "bg-success/10 text-success-dark dark:bg-success/20 dark:text-success-light",
      danger: "bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger-light",
      warning: "bg-warning/15 text-warning-dark dark:bg-warning/20 dark:text-warning",
      neutral: "bg-gray text-black dark:bg-meta-4 dark:text-bodydark1",
    },
  },
  defaultVariants: { color: "neutral" },
});

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  color?: "primary" | "success" | "danger" | "warning" | "neutral";
};

export const Badge = ({ color, className, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ color }), className)} {...props} />
);
