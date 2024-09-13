import { useActivateAccountModel } from "./activate-account.model";

type ActivateAccountProps = ReturnType<typeof useActivateAccountModel>;

export const ActivateAccountView = (props: ActivateAccountProps) => {
  const { type, message } = props;
  return (
    <div className="w-full p-2 sm:p-12.5 xl:p-17.5">
      <span className="mb-1.5 block font-medium">
        Dashboard production review
      </span>
      <h2 className="text-2xl font-bold text-black mb-9 dark:text-white sm:text-title-xl2">
        Active conta
      </h2>

      {type === "error" ? (
        <div className="p-2 mb-1 rounded bg-danger">
          <span className="text-slate-200">{message}</span>
        </div>
      ) : (
        <div className="p-2 mb-1 rounded bg-success">
          <span className="text-slate-200">{message}</span>
        </div>
      )}
    </div>
  );
};
