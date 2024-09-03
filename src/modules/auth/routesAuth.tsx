import { Navigate, Route, Routes } from "react-router-dom";
import { LayoutAuth } from "./Layout/LayoutAuth";
import { lazy, Suspense } from "react";
import { Loading } from "../../shared/components/loading/Loading";
import { useMeQuery } from "../../shared/hooks/useMeQuery";

const LoginView = lazy(() => import("./view/SignInView"));
const RegisterView = lazy(() => import("./view/SignUpView"));
const ForgotPasswordView = lazy(() => import("./view/ForgotPasswordView"));

const RouterAuth = () => {
  const { data, isLoading } = useMeQuery();
  console.log(data);

  if (data?.id && !isLoading) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Routes>
      <Route path="/" element={<LayoutAuth />}>
        <Route
          index
          element={
            <Suspense fallback={<Loading />}>
              <LoginView />
            </Suspense>
          }
        />
        <Route
          path="/sign-up"
          element={
            <Suspense fallback={<Loading />}>
              <RegisterView />
            </Suspense>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<Loading />}>
              <ForgotPasswordView />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default RouterAuth;
