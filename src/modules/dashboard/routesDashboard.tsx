import { Route, Routes } from "react-router-dom";
import { LayoutDashboard } from "./layout/DefaultLayout";
import { NotFoundView } from "../../shared/view/NotFoundView";
import CreateCateriePage from "./categorie/create-category/CreateCateryPage";
import { lazy, Suspense } from "react";
import { Loading } from "../../shared/components/loading/Loading";

const CreateSubCategoriePage = lazy(
  () => import("./sub-categorie/create-sub-categorie/CreateSubCategoriePage")
);

const ListCategoriePage = lazy(
  () => import("./categorie/list-categorie/ListCategoriePage")
);

const ListSubCategoriePage = lazy(
  () => import("./sub-categorie/list-sub-categorie/ListSubCategoriePage")
);

const RouterDashboard = () => {
  return (
    <LayoutDashboard>
      <Routes>
        <Route
          index
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <></>
            </Suspense>
          }
        />
        <Route
          path="/products"
          element={
            <Suspense fallback={<Loading />}>
              <></>
            </Suspense>
          }
        />
        <Route
          path="/products/add"
          element={
            <Suspense fallback={<Loading />}>
              <></>
            </Suspense>
          }
        />
        <Route
          path="/products/:id"
          element={
            <Suspense fallback={<Loading />}>
              <h1>Customers</h1>
            </Suspense>
          }
        />
        <Route
          path="/categories"
          element={
            <Suspense fallback={<Loading />}>
              <ListCategoriePage />
            </Suspense>
          }
        />
        <Route
          path="/categories/add"
          element={
            <Suspense fallback={<Loading />}>
              <CreateCateriePage />
            </Suspense>
          }
        />
        <Route
          path="/categories/:id"
          element={
            <Suspense fallback={<Loading />}>
              <h1>Customers</h1>
            </Suspense>
          }
        />
        <Route
          path="/subcategories"
          element={
            <Suspense fallback={<Loading />}>
              <ListSubCategoriePage />
            </Suspense>
          }
        />
        <Route
          path="/subcategories/add"
          element={
            <Suspense fallback={<Loading />}>
              <CreateSubCategoriePage />
            </Suspense>
          }
        />
        <Route
          path="/sub-categories/:id"
          element={
            <Suspense fallback={<Loading />}>
              <h1>Customers</h1>
            </Suspense>
          }
        />
        <Route
          path="/review"
          element={
            <Suspense fallback={<Loading />}>
              <h1>Customers</h1>
            </Suspense>
          }
        />
        <Route
          path="/review/add"
          element={
            <Suspense fallback={<Loading />}>
              <h1>Customers</h1>
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<Loading />}>
              <h1>Profile</h1>
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<Loading />}>
              <h1>Settings</h1>
            </Suspense>
          }
        />
        <Route
          path="products"
          element={
            <Suspense fallback={<Loading />}>
              <h1>Products</h1>
            </Suspense>
          }
        />
        <Route
          path="orders"
          element={
            <Suspense fallback={<Loading />}>
              <h1>Orders</h1>
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<Loading />}>
              <h1>Customers</h1>
            </Suspense>
          }
        />
        <Route
          path="*"
          element={<NotFoundView path="/" message="voltar para dashboard" />}
        />
      </Routes>
    </LayoutDashboard>
  );
};

export default RouterDashboard;
