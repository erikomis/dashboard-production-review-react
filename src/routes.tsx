import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Loading } from "./shared/components/loading/Loading";
import { ProtectedRouter } from "./ProtectedRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { queryClient } from "./shared/libs/react-query";
import RouterAuth from "./modules/auth/routesAuth";
const RouterDashboard = lazy(
  () => import("./modules/dashboard/routesDashboard")
);

export const Rout = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/*" element={<RouterAuth />} />
          <Route
            path="/dashboard/*"
            element={
              <Suspense fallback={<Loading />}>
                <ProtectedRouter>
                  <RouterDashboard />
                </ProtectedRouter>
              </Suspense>
            }
          />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </QueryClientProvider>
    </BrowserRouter>
  );
};
