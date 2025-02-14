import React from 'react'

const AdminDashBoard = () => {
    return <>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-7'>
            <div className='sm:col-span-6'>
                <img src="/line-chart.png" className='h-72 w-full' alt="" />
            </div>
            <div className='sm:col-span-6'>
                <img src="/bar-chart.png" className='h-72 w-full' alt="" />
            </div>
            <div className='sm:col-span-6'>
                <img src="/stacked-area.png" className='h-72 w-full' alt="" />
            </div>
            <div className='sm:col-span-6'>
                <img src="/stacked-bar.png" className='h-72 w-full' alt="" />
            </div>
        </div>
    </>
}

export default AdminDashBoard