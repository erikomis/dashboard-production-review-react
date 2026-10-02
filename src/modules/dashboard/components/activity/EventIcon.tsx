import {
  Activity,
  Download,
  Eye,
  EyeOff,
  FolderTree,
  ImageIcon,
  LogIn,
  MessageSquareText,
  Package,
  ShieldCheck,
  Tags,
  UserCog,
  UserPlus,
  UserRound,
} from "lucide-react";
import { EventIcon as EventIconName, EventTone } from "@/modules/dashboard/utils/activity-events";
import { cn } from "@/shared/utils/utils";

const ICONS: Record<EventIconName, React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>> = {
  user: UserRound,
  "user-plus": UserPlus,
  "log-in": LogIn,
  shield: ShieldCheck,
  "user-toggle": UserCog,
  tag: Tags,
  folder: FolderTree,
  package: Package,
  image: ImageIcon,
  message: MessageSquareText,
  "eye-off": EyeOff,
  eye: Eye,
  download: Download,
  activity: Activity,
};

const TONE_CLASSES: Record<EventTone, string> = {
  primary: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light",
  success: "bg-success/10 text-success-dark dark:bg-success/20 dark:text-success-light",
  danger: "bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger-light",
  warning: "bg-warning/15 text-warning-dark dark:bg-warning/20 dark:text-warning",
  info: "bg-meta-5/10 text-[#1A6FA8] dark:bg-meta-5/20 dark:text-meta-5",
  neutral: "bg-gray text-body dark:bg-meta-4 dark:text-bodydark1",
};

type EventIconProps = { icon: EventIconName; tone: EventTone; size?: "sm" | "md"; className?: string };

/** Ícone redondo colorido por tipo de evento (decorativo: o rótulo vem em texto ao lado). */
export const EventIcon = ({ icon, tone, size = "md", className }: EventIconProps) => {
  const Icon = ICONS[icon] ?? Activity;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        size === "md" ? "h-9 w-9" : "h-6 w-6",
        TONE_CLASSES[tone],
        className
      )}
    >
      <Icon size={size === "md" ? 16 : 12} aria-hidden />
    </span>
  );
};
