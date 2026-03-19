import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LayoutDashboard } from "./layout/DefaultLayout";
import { NotFoundView } from "@/shared/view/NotFoundView";

const HomePage = lazy(() => import("./view/home/HomePage"));
const ProductListPage = lazy(() => import("./view/product-list/ProductListPage"));
const CreateProductPage = lazy(() => import("./view/create-product/CreateProductPage"));
const EditProductPage = lazy(() => import("./view/edit-product/EditProductPage"));
const CategoryListPage = lazy(() => import("./view/category-list/CategoryListPage"));
const CreateCategoryPage = lazy(() => import("./view/create-category/CreateCategoryPage"));
const EditCategoryPage = lazy(() => import("./view/edit-category/EditCategoryPage"));
const SubCategoryListPage = lazy(() => import("./view/sub-category-list/SubCategoryListPage"));
const CreateSubCategoryPage = lazy(() => import("./view/create-sub-category/CreateSubCategoryPage"));
const EditSubCategoryPage = lazy(() => import("./view/edit-sub-category/EditSubCategoryPage"));
const ReviewListPage = lazy(() => import("./view/review-list/ReviewListPage"));
const CreateReviewPage = lazy(() => import("./view/create-review/CreateReviewPage"));
const EditReviewPage = lazy(() => import("./view/edit-review/EditReviewPage"));
const ProfilePage = lazy(() => import("./view/profile/ProfilePage"));

const RouterDashboard = () => {
  return (
    <LayoutDashboard>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <span className="text-gray-500">Carregando...</span>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/home" replace />} />

          {/* Home */}
          <Route path="/home" element={<HomePage />} />

          {/* Produtos */}
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/add" element={<CreateProductPage />} />
          <Route path="/products/:id" element={<EditProductPage />} />

          {/* Categorias */}
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/categories/add" element={<CreateCategoryPage />} />
          <Route path="/categories/:id" element={<EditCategoryPage />} />

          {/* Subcategorias */}
          <Route path="/sub-categories" element={<SubCategoryListPage />} />
          <Route path="/sub-categories/add" element={<CreateSubCategoryPage />} />
          <Route path="/sub-categories/:id" element={<EditSubCategoryPage />} />

          {/* Avaliações */}
          <Route path="/review" element={<ReviewListPage />} />
          <Route path="/review/add" element={<CreateReviewPage />} />
          <Route path="/review/:id" element={<EditReviewPage />} />

          {/* Perfil e Configurações */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/settings"
            element={
              <h1 className="text-2xl font-semibold text-black dark:text-white">
                Configurações
              </h1>
            }
          />

          {/* 404 dentro do dashboard */}
          <Route
            path="*"
            element={
              <NotFoundView
                path="/dashboard/home"
                message="Voltar ao Dashboard"
              />
            }
          />
        </Routes>
      </Suspense>
    </LayoutDashboard>
  );
};

export default RouterDashboard;
