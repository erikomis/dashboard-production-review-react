import { Link, Outlet } from "react-router-dom";
import { Logo } from "../../../shared/components/svgs/Logo";

export const LayoutAuth = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen ">
      <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <Link className="mb-5.5 inline-block" to="/"></Link>
              <p className="2xl:px-20">Production review dashboard</p>
              <span className="inline-block mt-15">
                <Logo />
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
