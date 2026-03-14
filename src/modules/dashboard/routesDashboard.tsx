import { Navigate, Route, Routes } from "react-router-dom";
import { LayoutDashboard } from "./layout/DefaultLayout";
import { HomeView } from "./view/HomeView";
import { ProductView } from "./view/ProductView";
import { CreateProduct } from "./view/CreateProduct";
import { EditProduct } from "./view/EditProduct";
import { CategoryView } from "./view/CategoryView";
import { CreateCategory } from "./view/CreateCategory";
import { EditCategory } from "./view/EditCategory";
import { SubCategoryView } from "./view/SubCategoryView";
import { CreateSubCategory } from "./view/CreateSubCategory";
import { EditSubCategory } from "./view/EditSubCategory";
import { ReviewView } from "./view/ReviewView";
import { CreateReview } from "./view/CreateReview";
import { EditReview } from "./view/EditReview";
import { ProfileView } from "./view/ProfileView";
import { NotFoundView } from "../../shared/view/NotFoundView";

const RouterDashboard = () => {
  return (
    <LayoutDashboard>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/home" replace />} />

        {/* Home */}
        <Route path="/home" element={<HomeView />} />

        {/* Produtos */}
        <Route path="/products" element={<ProductView />} />
        <Route path="/products/add" element={<CreateProduct />} />
        <Route path="/products/:id" element={<EditProduct />} />

        {/* Categorias */}
        <Route path="/categories" element={<CategoryView />} />
        <Route path="/categories/add" element={<CreateCategory />} />
        <Route path="/categories/:id" element={<EditCategory />} />

        {/* Subcategorias */}
        <Route path="/sub-categories" element={<SubCategoryView />} />
        <Route path="/sub-categories/add" element={<CreateSubCategory />} />
        <Route path="/sub-categories/:id" element={<EditSubCategory />} />

        {/* Avaliações */}
        <Route path="/review" element={<ReviewView />} />
        <Route path="/review/add" element={<CreateReview />} />
        <Route path="/review/:id" element={<EditReview />} />

        {/* Perfil e Configurações */}
        <Route path="/profile" element={<ProfileView />} />
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
    </LayoutDashboard>
  );
};

export default RouterDashboard;
