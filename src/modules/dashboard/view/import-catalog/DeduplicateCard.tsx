import { Link } from "react-router-dom";
import { CheckCircle2, CopyX, Layers } from "lucide-react";
import { Card } from "@/modules/dashboard/components/card/Card";
import { Button } from "@/shared/components/button";
import { ConfirmModal } from "@/shared/components/Modal/confirm-modal";
import { useImportCatalogModel } from "./import-catalog.model";

type Props = Pick<
  ReturnType<typeof useImportCatalogModel>,
  | "dedupeResult"
  | "dedupeAnnouncement"
  | "isDeduplicating"
  | "dedupeConfirmOpen"
  | "requestDeduplicate"
  | "cancelDeduplicate"
  | "confirmDeduplicate"
  | "running"
>;

const IdList = ({ ids, linked }: { ids: number[]; linked: boolean }) => (
  <ul className="mt-1 flex flex-wrap gap-1.5">
    {ids.map((id) => (
      <li key={id}>
        {linked ? (
          <Link
            to={`/dashboard/products/${id}`}
            className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-primary/20 dark:text-primary-light"
          >
            #{id}
            <span className="sr-only"> (abrir produto)</span>
          </Link>
        ) : (
          <span className="inline-flex rounded-full bg-gray px-2 py-0.5 text-xs text-body line-through dark:bg-meta-4 dark:text-bodydark">
            #{id}
          </span>
        )}
      </li>
    ))}
  </ul>
);

/** "Remover duplicados": confirmação e resumo do `POST /admin/catalog/deduplicate`. */
export const DeduplicateCard = ({
  dedupeResult: result,
  dedupeAnnouncement,
  isDeduplicating,
  dedupeConfirmOpen,
  requestDeduplicate,
  cancelDeduplicate,
  confirmDeduplicate,
  running,
}: Props) => (
  <Card
    title="Remover duplicados"
    titleId="dedupe-title"
    description="Produtos com o mesmo nome na mesma subcategoria (ignorando acentos e maiúsculas)."
  >
    <span className="sr-only" role="status" aria-live="polite">
      {dedupeAnnouncement}
    </span>
    <ul className="mb-4 space-y-1.5 text-sm text-body dark:text-bodydark">
      <li className="flex gap-2">
        <Layers size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-primary dark:text-primary-light" />
        <span>Em cada grupo, o produto mais antigo é mantido.</span>
      </li>
      <li className="flex gap-2">
        <CopyX size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-primary dark:text-primary-light" />
        <span>
          Só saem os repetidos <strong className="font-medium text-black dark:text-white">sem avaliações</strong>, junto com
          as fotos externas.
        </span>
      </li>
    </ul>
    <Button
      color="outline"
      onClick={requestDeduplicate}
      disabled={running}
      isLoading={isDeduplicating}
      leftIcon={<CopyX size={16} aria-hidden="true" />}
      title={running ? "Aguarde a importação terminar" : undefined}
    >
      {isDeduplicating ? "Removendo..." : "Remover duplicados"}
    </Button>

    {result && (
      <div
        className="mt-4 rounded-lg border border-success/40 bg-success/5 p-4 animate-fade-up dark:bg-success/10"
        aria-labelledby="dedupe-result-title"
        role="group"
      >
        <h3 id="dedupe-result-title" className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
          <CheckCircle2 size={18} aria-hidden="true" className="text-success-dark dark:text-success-light" />
          {result.removed === 0 ? "Nenhum duplicado para remover" : "Duplicados removidos"}
        </h3>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md bg-white px-3 py-2 dark:bg-boxdark">
            <dt className="text-xs text-body dark:text-bodydark">Grupos encontrados</dt>
            <dd className="text-title-xsm font-bold tabular-nums text-black dark:text-white">{result.groups}</dd>
          </div>
          <div className="rounded-md bg-white px-3 py-2 dark:bg-boxdark">
            <dt className="text-xs text-body dark:text-bodydark">Produtos removidos</dt>
            <dd className="text-title-xsm font-bold tabular-nums text-black dark:text-white">{result.removed}</dd>
          </div>
        </dl>
        {result.removed === 0 && (
          <p className="mt-3 text-sm text-body dark:text-bodydark">
            {result.groups === 0
              ? "O catálogo não tem produtos repetidos."
              : "Os repetidos que restam têm avaliações e por isso foram mantidos."}
          </p>
        )}
        {result.keptIds.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-black dark:text-bodydark1">Mantidos</p>
            <IdList ids={result.keptIds} linked />
          </div>
        )}
        {result.removedIds.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-black dark:text-bodydark1">Removidos</p>
            <IdList ids={result.removedIds} linked={false} />
          </div>
        )}
      </div>
    )}

    <ConfirmModal
      isOpen={dedupeConfirmOpen}
      title="Remover produtos duplicados"
      message={
        <>
          Os produtos repetidos <strong className="text-black dark:text-white">sem avaliações</strong> serão excluídos do
          catálogo; em cada grupo fica o mais antigo.
        </>
      }
      confirmLabel="Remover duplicados"
      loadingLabel="Removendo..."
      isLoading={isDeduplicating}
      onConfirm={confirmDeduplicate}
      onClose={cancelDeduplicate}
    />
  </Card>
);
