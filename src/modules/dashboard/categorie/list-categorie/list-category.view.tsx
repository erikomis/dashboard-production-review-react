import { FilePenLine, Trash2 } from "lucide-react";
import { Button } from "../../../../shared/components/button";
import { Table } from "../../components/table";
import { useListCategoryModel } from "./list-category.model";
import { UpdateCategory } from "../update-category/update-category.type";

type ListCategoryViewProps = ReturnType<typeof useListCategoryModel> & {
  UpdateCategory: (product: UpdateCategory) => void;
  deleleteCategory: (id: number) => void;
};

const headers = [
  { name: "id" },
  { name: "name" },
  { name: "descrição" },
  { name: "slug" },
  { name: "Ações" },
];

export const ListCategoryView = (props: ListCategoryViewProps) => {
  const { data, isLoading, UpdateCategory, deleleteCategory } = props;
  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <Table.Root>
            <Table.Thead>
              <Table.Tr className="text-left bg-gray-2 dark:bg-meta-4">
                {headers.map((header, key) => (
                  <Table.Th
                    className={`${
                      key === 0
                        ? "min-w-[220px]"
                        : key === 1
                        ? "min-w-[150px]"
                        : key === 2
                        ? "min-w-[120px]"
                        : ""
                    }py-4 px-4 font-medium text-black dark:text-white xl:pl-11`}
                    key={key}
                  >
                    {header.name}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isLoading && (
                <Table.Tr className="flex items-center w-full">
                  <Table.Td>Loading...</Table.Td>
                </Table.Tr>
              )}
              {data?.map((product, key) => (
                <Table.Tr key={key}>
                  <Table.Td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {product.id}
                    </h5>
                  </Table.Td>
                  <Table.Td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <p className="text-black dark:text-white">{product.name}</p>
                  </Table.Td>
                  <Table.Td>
                    <p
                      className={
                        `inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium`
                        // product.id === "Paid"
                        //   ? "bg-success text-success"
                        //   : product.id === "Unpaid"
                        //   ? "bg-danger text-danger"
                        //   : "bg-warning text-warning"
                      }
                    >
                      {product.description}
                    </p>
                  </Table.Td>
                  <Table.Td>
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium
                          
                      //   product.id === "Paid"
                      //     ? "bg-success text-success"
                      //     : product.id === "Unpaid"
                      //     ? "bg-danger text-danger"
                      //     : "bg-warning text-warning"
                     
              `}
                    >
                      {product.slug}
                    </p>
                  </Table.Td>
                  <Table.Td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <div className="flex items-center space-x-3.5">
                      <Button
                        type="button"
                        color="ghost"
                        onClick={() => UpdateCategory(product)}
                      >
                        <FilePenLine />
                      </Button>
                      <Button
                        color="ghost"
                        type="button"
                        onClick={() => deleleteCategory(product.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table.Root>
        </div>
      </div>
    </>
  );
};
