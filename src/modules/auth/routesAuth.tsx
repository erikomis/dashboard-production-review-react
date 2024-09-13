import { Navigate, Route, Routes } from "react-router-dom";
import { LayoutAuth } from "./Layout/LayoutAuth";
import { lazy, Suspense } from "react";
import { Loading } from "../../shared/components/loading/Loading";
import { NotFoundView } from "../../shared/view/NotFoundView";
import { useMeQuery } from "../../shared/hooks/useMeQuery";

const LoginView = lazy(() => import("./sign-in/SignInPage"));
const RegisterView = lazy(() => import("./sign-up/signUpPage"));
const ForgotPasswordView = lazy(
  () => import("./forgot-password/ForgotPasswordPage")
);
const ActivateAccountView = lazy(
  () => import("./activate-Account/ActivateAccountPage")
);

const ResetPasswordView = lazy(
  () => import("./reset-password/ResetPasswordPage")
);
const RouterAuth = () => {
  const { isSuccess } = useMeQuery();

  if (isSuccess) {
    return <Navigate to="/dashboard/" />;
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
        <Route
          path="/activate-account/:token"
          element={
            <Suspense fallback={<Loading />}>
              <ActivateAccountView />
            </Suspense>
          }
        />
        <Route
          path="/reset-password"
          element={
            <Suspense fallback={<Loading />}>
              <ResetPasswordView />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="/404"
        element={<NotFoundView path="/" message="Voltar para login" />}
      />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
};

export default RouterAuth;
