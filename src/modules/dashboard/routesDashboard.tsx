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
const ImportCatalogPage = lazy(() => import("./view/import-catalog/ImportCatalogPage"));
const UsersPage = lazy(() => import("./view/users/UsersPage"));
const ActivityPage = lazy(() => import("./view/activity/ActivityPage"));
const ProfilePage = lazy(() => import("./view/profile/ProfilePage"));
const SettingsPage = lazy(() => import("./view/settings/SettingsPage"));

const RouterDashboard = () => {
  return (
    <LayoutDashboard>
      <Suspense
        fallback={
          <div role="status" className="flex items-center justify-center gap-3 py-20 text-body dark:text-bodydark">
            <span aria-hidden="true" className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            Carregando...
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

          {/* Importação de catálogo */}
          <Route path="/import" element={<ImportCatalogPage />} />

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

          {/* Moderação = aba "Ocultas" da tela de avaliações */}
          <Route path="/moderation" element={<Navigate to="/dashboard/review?status=HIDDEN" replace />} />

          {/* Comunidade e sistema */}
          <Route path="/users" element={<UsersPage />} />
          <Route path="/activity" element={<ActivityPage />} />

          {/* Perfil e Configurações */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* 404 dentro do dashboard */}
          <Route
            path="*"
            element={
              <NotFoundView
                path="/dashboard/home"
                message="Voltar à visão geral"
                embedded
              />
            }
          />
        </Routes>
      </Suspense>
    </LayoutDashboard>
  );
};

export default RouterDashboard;
