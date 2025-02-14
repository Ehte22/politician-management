import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import TableData from "../../components/TableData";
import Loader from "../../components/Loader";
import { useDeleteBoothMutation, useGetBoothsQuery } from "../../redux/apis/booth.api";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { toast } from "../../utils/toast";

const columns = [
    {
        header: "Name",
        accessorKey: "name",
        cell: (info) => info.getValue()
    },
    {
        header: "Booth Number",
        accessorKey: "boothNumber",
        cell: (info) => info.getValue(),
    },
    {
        header: "Constituency",
        accessorKey: "constituency",
        cell: (info) => info.getValue(),
    },
    {
        header: "Capacity",
        accessorKey: "capacity",
        cell: (info) => info.getValue(),
    },
    // {
    //     header: "Location",
    //     accessorKey: "location",
    //     cell: (info) => info.getValue(),
    // },

    {
        header: "Location",
        accessorKey: "location",
        cell: (info) => (
            <div className="whitespace-normal break-words max-w-[350px]">
                {info.getValue()}
            </div>
        ),
    },

    {
        header: "Actions",
        cell: (info) => {
            const row = info.row.original;
            const navigate = useNavigate()
            const [open, setOpen] = useState(false)

            const [deleteBooth, { data, error, isSuccess, isError }] = useDeleteBoothMutation()

            useEffect(() => {
                if (isSuccess) {
                    toast.showSuccess(data)
                    setOpen(false)
                }

                if (isError) {
                    toast.showSuccess(error)
                }
            }, [data, error, isSuccess, isError])


            return <>
                <div>
                    <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => navigate(`/update-booth/${row._id}`)}
                    >
                        Edit
                    </button>
                    <button
                        className="text-red-600 hover:text-red-700 ms-5"
                        onClick={() => setOpen(true)}
                    >
                        Delete
                    </button>
                </div>

                <Dialog open={open} onClose={setOpen} className="relative z-10">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                    />

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                                transition
                                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                            >
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                        <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                            Delete Booth
                                        </DialogTitle>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete this booth?
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            deleteBooth(row._id)
                                        }}
                                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        data-autofocus
                                        onClick={() => setOpen(false)}
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            </>
        },
    },
];

const Booths = () => {
    // States
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [searchQuery, setSearchQuery] = useState("");

    // Hooks
    const navigate = useNavigate()

    // Queries and Mutations
    const { data, isLoading } = useGetBoothsQuery({
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
                    <h2 className="text-lg font-bold text-gray-900">Booths</h2>
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
                        onClick={() => navigate("/add-booth")}
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">

                        <TableData
                            data={data.result || []}
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

export default Booths