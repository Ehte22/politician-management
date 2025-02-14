import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import TableData from "../../components/TableData";
import { format } from "date-fns";
import { useGetAllVisitorsQuery } from "../../redux/apis/visitor.api";
const columns = [
    {
        header: "Name",
        accessorKey: "name",
        cell: (info) => info.getValue(),
    },
    {
        header: "Phone Number",
        accessorKey: "contact",
        cell: (info) => info.getValue(),
    },
    {
        header: "email",
        accessorKey: "email",
        cell: (info) => info.getValue(),
    },


    {
        header: "Actions",
        cell: (info) => {
            const row = info.row.original;
            const navigate = useNavigate()

            return (
                <button
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={() => navigate(`/update-visitor/${row._id}`)}
                >
                    Edit
                </button>
            );
        },
    },
];

const Visitor = () => {

    // Hooks
    // const [pagination, setPagination] = useState < { pageIndex: number, pageSize: number } > ({ pageIndex: 0, pageSize: 10 });
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate()


    const { data, isLoading, isSuccess } = useGetAllVisitorsQuery()



    // useEffect(() => {
    //     fetchClincs({
    //         page: pagination.pageIndex + 1,
    //         limit: pagination.pageSize,
    //         searchQuery: searchQuery.toLowerCase()
    //     })
    //     socket.on("fetch-clinic", () => {
    //         console.log("DDDDDDDDDDDDDDDDDDDDDDDD");

    //         fetchClincs({
    //             page: pagination.pageIndex + 1,
    //             limit: pagination.pageSize,
    //             searchQuery: searchQuery.toLowerCase()
    //         })
    //         console.log("FROM SOCKETTT");

    //     })
    //     socket.on("connect", () => {
    //         console.log("Socket connected:", socket.id);
    //     });

    //     console.log("FROM ");

    // }, [isSuccess, data])


    return <>

        <div>
            <div className="sm:flex sm:items-center justify-center">
                <div className="sm:flex-auto">
                    <h2 className="text-lg font-bold text-gray-900">Visitors</h2>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 flex justify-end gap-5">
                    {/* <input
                        type="text"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="block w-72 h-10 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    /> */}
                    <button
                        type="button"
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => navigate("/add-visitor")}
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">

                        <TableData
                            data={data || []}
                            columns={columns}
                            enableSorting={true}
                            enableGlobalFilter={true}
                            // initialPagination={pagination}
                            totalRows={data?.totalPages || 0}
                            // onPaginationChange={setPagination}
                            onGlobalFilterChange={searchQuery}
                            totalPages={data?.totalPages}
                        />

                    </div>
                </div>
            </div>
        </div >
    </>
}

export default Visitor