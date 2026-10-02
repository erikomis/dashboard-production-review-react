import { Link } from "react-router-dom";
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { useActivateAccountModel } from "./activate-account.model";
import { AuthHeading } from "../AuthHeading";
import { buttonVariants } from "@/shared/components/button-variants";

type ActivateAccountProps = ReturnType<typeof useActivateAccountModel>;

export const ActivateAccountView = ({ status, message }: ActivateAccountProps) => {
  const styles = {
    loading: "border-stroke bg-gray-2 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white",
    success: "border-success/30 bg-success/10 text-success-dark dark:text-success-light",
    error: "border-danger/30 bg-danger/10 text-danger dark:text-danger-light",
  }[status];

  return (
    <div className="w-full p-6 sm:p-12.5 xl:p-17.5">
      <AuthHeading title="Ativação de conta" />
      <div
        role={status === "error" ? "alert" : "status"}
        aria-live="polite"
        className={`flex items-start gap-3 rounded-lg border p-4 ${styles}`}
      >
        {status === "loading" && <LoaderCircle size={22} aria-hidden="true" className="shrink-0 animate-spin" />}
        {status === "success" && <CircleCheck size={22} aria-hidden="true" className="shrink-0" />}
        {status === "error" && <CircleX size={22} aria-hidden="true" className="shrink-0" />}
        <p>{message}</p>
      </div>
      {status !== "loading" && (
        <Link to="/" className={`${buttonVariants({ size: "lg" })} mt-6 w-full`}>
          Ir para o login
        </Link>
      )}
    </div>
  );
};
