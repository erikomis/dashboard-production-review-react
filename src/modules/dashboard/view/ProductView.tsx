import { Table } from "../components/table";
import { useQueryProducts } from "../hooks/useQueryProducts";

const headers = [
  { name: "id" },
  { name: "name" },
  { name: "descrição" },
  { name: "slug" },
];
export const ProductView = () => {
  const {  isLoading } = useQueryProducts();

  return (
    <div className="flex flex-col gap-10 overflow-auto">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <Table.Root>
          <Table.Thead>
            <Table.Tr className="text-left bg-gray-2 dark:bg-meta-4">
              {headers.map((header, key) => (
                <Table.Th key={key}>{header.name}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading && (
              <Table.Tr className="flex items-center w-full">
                <Table.Td>Loading...</Table.Td>
              </Table.Tr>
            )}

            {/* {data?.content?.map((product, key) => (
              <Table.Tr key={key}>
                <Table.Td>{product.id}</Table.Td>
                <Table.Td>{product.name}</Table.Td>
                <Table.Td>{product.description}</Table.Td>
                <Table.Td>{product.slug}</Table.Td>
              </Table.Tr>
            ))} */}
            {/* {packageData.map((packageItem, key) => (
              <Table.Tr key={key}>
                <Table.Td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {packageItem.name}
                  </h5>
                  <p className="text-sm">${packageItem.price}</p>
                </Table.Td>
                <Table.Td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <p className="text-black dark:text-white">
                    {packageItem.invoiceDate}
                  </p>
                </Table.Td>
                <Table.Td>
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      packageItem.status === "Paid"
                        ? "bg-success text-success"
                        : packageItem.status === "Unpaid"
                        ? "bg-danger text-danger"
                        : "bg-warning text-warning"
                    }`}
                  >
                    {packageItem.status}
                  </p>
                </Table.Td>
                <Table.Td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <div className="flex items-center space-x-3.5">
                    <button className="text-primary">Edit</button>
                    <button className="text-danger">Delete</button>
                  </div>
                </Table.Td>
              </Table.Tr>
            ))} */}
          </Table.Tbody>
        </Table.Root>
      </div>
    </div>
  );
};
