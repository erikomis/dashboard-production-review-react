import { Route, Routes } from "react-router-dom";
import { LayoutDashboard } from "./layout/DefaultLayout";
import { ProductView } from "./view/ProductView";
import { CategoryView } from "./view/CategoryView";
import { CreateCategory } from "./view/CreateCategory";

const RouterDashboard = () => {
  return (
    <LayoutDashboard>
      <Routes>
        <Route path="/" element={<ProductView />} />
        <Route path="/products" element={<ProductView />} />
        <Route path="/products/add" element={<h1>Customers</h1>} />
        <Route path="/products/:id" element={<h1>Customers</h1>} />
        <Route path="/categories" element={<CategoryView />} />
        <Route path="/categories/add" element={<CreateCategory />} />
        <Route path="/categories/:id" element={<h1>Customers</h1>} />
        <Route path="/sub-categories" element={<h1>Customers</h1>} />
        <Route path="/sub-categories/add" element={<h1>Customers</h1>} />
        <Route path="/sub-categories/:id" element={<h1>Customers</h1>} />
        <Route path="/review" element={<h1>Customers</h1>} />
        <Route path="/review/add" element={<h1>Customers</h1>} />
        <Route path="profile" element={<h1>Profile</h1>} />
        <Route path="settings" element={<h1>Settings</h1>} />
        <Route path="products" element={<h1>Products</h1>} />
        <Route path="orders" element={<h1>Orders</h1>} />
      </Routes>
    </LayoutDashboard>
  );
};

export default RouterDashboard;
