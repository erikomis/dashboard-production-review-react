import { useState } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type LayoutDashboardProps = {
  children: React.ReactNode;
};

export function LayoutDashboard({ children }: LayoutDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col lg:ml-72.5">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main  className="dark:bg-boxdark-2 dark:text-bodydark">
            <div className="p-4 mx-auto max-w-screen-2xl md:p-6 2xl:p-10">
             {children}
            </div>
          </main>
        </div>
      </div>

    
    </>
  );
}
// {/* <div className="dark:bg-boxdark-2 dark:text-bodydark">
// {/* <!-- ===== Page Wrapper Start ===== --> */}
// <div className="flex h-screen">
//   {/* <!-- ===== Sidebar Start ===== --> */}
//   <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//   {/* <!-- ===== Sidebar End ===== --> */}

//   {/* <!-- ===== Content Area Start ===== --> */}
//   <div className="relative flex flex-1 flex-col lg:ml-72.5">
//     {/* <!-- ===== Header Start ===== --> */}
//     <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//     {/* <!-- ===== Header End ===== --> */}

//     {/* <!-- ===== Main Content Start ===== --> */}
//     <main>
//       <div className="p-4 mx-auto max-w-screen-2xl md:p-6 2xl:p-10">
//         {children}
//       </div>
//     </main>
//     {/* <!-- ===== Main Content End ===== --> */}
//   </div>
//   {/* <!-- ===== Content Area End ===== --> */}
// </div>
// {/* <!-- ===== Page Wrapper End ===== --> */}
// </div> */}