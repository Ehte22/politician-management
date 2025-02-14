import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDeleteWishMutation, useGetAllWishesQuery } from '../redux/apis/wish.api';
import TableData from '../components/TableData';
import Loader from '../components/Loader';



const WishTable = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const { data: searchData, isLoading } = useGetAllWishesQuery({
        search: searchQuery,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    const navigate = useNavigate();
    const [deleteWish] = useDeleteWishMutation();

    const handleDeleteWish = async (wishesData) => {
        if (window.confirm('Are you sure you want to delete this wish?')) {
            try {
                await deleteWish(wishesData).unwrap();
            } catch (error) {
                console.error('Error deleting wish:', error);
            }
        }
    };

    const columns = [
        {
            accessorKey: 'name',
            cell: (info) => info.getValue(),
            header: 'Wish Name',
        },
        {
            accessorKey: 'contact',
            cell: (info) => info.getValue(),
            header: 'Contact Info',
        },
        {
            header: 'Actions',
            cell: (info) => {
                const row = info.row.original;
                return (
                    <div>
                        <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => navigate(`/wish/${row._id}`)}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteWish(row._id)}
                            className="text-red-600 hover:text-red-800 ms-7"
                        >
                            Delete
                        </button>
                    </div>
                );
            },
        },
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen -mt-20">
                <Loader size={16} />
            </div>
        );
    }

    return (
        <>
            <div>
                <div className="sm:flex sm:items-center justify-center">
                    <div className="sm:flex-auto">
                        <h2 className="text-lg font-bold text-gray-900">Wishes</h2>
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
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => navigate('/wish')}
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div className="mt-8 flow-root">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            {searchData && (
                                <TableData
                                    data={searchData || []}
                                    columns={columns}
                                    enableSorting={true}
                                    onPaginationChange={setPagination}
                                    enableGlobalFilter={true}
                                    onGlobalFilterChange={searchQuery}
                                    initialPagination={pagination}
                                    totalPages={searchData?.pagination?.totalPages}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WishTable;
