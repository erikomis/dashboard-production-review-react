import { tv } from "tailwind-variants";

/** Classes do botão, reutilizáveis em <Link> com aparência de botão. */
export const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-boxdark disabled:pointer-events-none disabled:opacity-60",
  variants: {
    color: {
      default: "bg-primary text-white hover:bg-primary/90",
      destructive: "bg-danger text-white hover:bg-danger/90",
      danger: "bg-danger text-white hover:bg-danger/90",
      outline:
        "border border-stroke bg-white text-black hover:bg-gray-2 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4",
      secondary:
        "bg-gray text-black hover:bg-stroke dark:bg-meta-4 dark:text-white dark:hover:bg-strokedark",
      ghost:
        "text-black hover:bg-gray-2 dark:text-white dark:hover:bg-meta-4",
      link: "text-primary underline-offset-4 hover:underline dark:text-primary-light",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      xs: "h-7 rounded-md px-2 text-xs",
      lg: "h-12 rounded-lg px-8 text-base",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    color: "default",
    size: "default",
  },
});
