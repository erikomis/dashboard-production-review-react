import { Star, Package, Tag, Layers } from "lucide-react";
import { useHomeModel } from "./home.model";
import { Review } from "@/shared/types/review";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

const StatCard = ({ title, value, icon, color, onClick }: StatCardProps) => (
  <div
    onClick={onClick}
    className={`rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm font-medium text-bodydark2">{title}</span>
        <h4 className="mt-2 text-3xl font-bold text-black dark:text-white">{value}</h4>
      </div>
      <div className={`flex h-11.5 w-11.5 items-center justify-center rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

type HomeViewProps = ReturnType<typeof useHomeModel>;

export const HomeView = ({
  totalProducts,
  totalCategories,
  totalSubCategories,
  totalReviews,
  avgRating,
  recentReviews,
  navigate,
}: HomeViewProps) => {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-semibold text-black dark:text-white">Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total de Produtos"
          value={totalProducts}
          icon={<Package size={22} className="text-white" />}
          color="bg-primary"
          onClick={() => navigate("/dashboard/products")}
        />
        <StatCard
          title="Categorias"
          value={totalCategories}
          icon={<Tag size={22} className="text-white" />}
          color="bg-meta-3"
          onClick={() => navigate("/dashboard/categories")}
        />
        <StatCard
          title="Sub-categorias"
          value={totalSubCategories}
          icon={<Layers size={22} className="text-white" />}
          color="bg-meta-6"
          onClick={() => navigate("/dashboard/sub-categories")}
        />
        <StatCard
          title="Total de Avaliações"
          value={totalReviews}
          icon={<Star size={22} className="text-white" />}
          color="bg-warning"
          onClick={() => navigate("/dashboard/review")}
        />
      </div>

      {/* Nota média */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:col-span-1">
          <p className="text-sm font-medium text-bodydark2">Nota Média</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-4xl font-bold text-black dark:text-white">{avgRating}</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i < Math.round(Number(avgRating))
                      ? "text-warning fill-warning"
                      : "text-gray-300 fill-gray-300"
                  }
                />
              ))}
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            baseado em {typeof totalReviews === "number" ? totalReviews : 0} avaliações
          </p>
        </div>
      </div>

      {/* Avaliações recentes */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Avaliações Recentes
          </h3>
          <button
            onClick={() => navigate("/dashboard/review")}
            className="text-sm text-primary hover:underline"
          >
            Ver todas →
          </button>
        </div>

        {recentReviews.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">Nenhuma avaliação ainda.</p>
        ) : (
          <div className="flex flex-col divide-y divide-stroke dark:divide-strokedark">
            {recentReviews.map((review: Review) => (
              <div key={review.id} className="flex items-start justify-between gap-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black dark:text-white truncate">
                    {review.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {review.product?.name ?? "Produto"}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < review.rating
                          ? "text-warning fill-warning"
                          : "text-gray-300 fill-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
