import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { useGetUsersQuery, useUpdateUserStatusMutation } from "../../redux/apis/user.api";
import { toast } from "../../utils/toast";
import TableData from "../../components/TableData";
import Loader from "../../components/Loader";

const columns = [
    {
        header: "Full Name",
        accessorKey: "firstName",
        cell: (info) => {
            const row = info.row.original;
            return `${row.firstName} ${row.lastName}`;
        },
    },
    {
        header: "Email Address",
        accessorKey: "email",
        cell: (info) => info.getValue(),
    },
    {
        header: "Phone Number",
        accessorKey: "phone",
        cell: (info) => info.getValue(),
    },
    // {
    //     header: "Clinic",
    //     accessorKey: "clinicId",
    //     cell: (info) => {
    //         const row = info.row.original
    //         const { data } = useGetClinicsQuery({ isFetchAll: true })

    //         const clinic = data?.result.find(item => item._id === row.clinicId)
    //         return clinic?.name
    //     },
    // },
    {
        header: "Role",
        accessorKey: "role",
        cell: (info) => info.getValue(),
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
            const row = info.row.original
            const [updateUserStatus, { data, error, isSuccess, isError }] = useUpdateUserStatusMutation()

            const updateStatus = () => {
                const status = row.status === "active" ? "inactive" : "active"
                updateUserStatus({ status, id: row._id })
            }

            useEffect(() => {
                if (isSuccess) {
                    toast.showSuccess(data)
                }

                if (isError) {
                    toast.showError(error)
                }
            }, [data, error, isSuccess, isError])

            return (
                <button
                    onClick={updateStatus}
                    className={
                        row.status === "active"
                            ? "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                            : "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20"
                    }
                >
                    {row.status === "active" && "Active"}
                    {row.status === "inactive" && "Inactive"}
                </button>
            );
        },
    },
    {
        header: "Actions",
        cell: (info) => {
            const row = info.row.original;
            const navigate = useNavigate()

            return (
                <button
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={() => navigate(`/update-user/${row._id}`)}
                >
                    Edit
                </button>
            );
        },
    },
];

const Users = () => {
    // States
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [searchQuery, setSearchQuery] = useState("");

    // Hooks
    const navigate = useNavigate()

    // Queries and Mutations
    const { data, isLoading } = useGetUsersQuery({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        searchQuery: searchQuery.toLowerCase()
    })

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen -mt-20">
            <Loader size={16} />
        </div>
    }

    return <>
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h2 className="text-lg font-bold text-gray-900">Users</h2>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 flex justify-between gap-5">
                    <input
                        type="text"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="block w-72 h-10 rounded-md bg-white px-3 py-1.5 text-base text-gray-900  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400  focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <button
                        type="button"
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => navigate("/add-user")}
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">

                        <TableData
                            data={data?.result || []}
                            columns={columns}
                            enableSorting={true}
                            enableGlobalFilter={true}
                            initialPagination={pagination}
                            totalRows={data?.totalPages || 0}
                            onPaginationChange={setPagination}
                            onGlobalFilterChange={searchQuery}
                            totalPages={data?.totalPages}
                        />

                    </div>
                </div>
            </div>
        </div >
    </>
}

export default Users