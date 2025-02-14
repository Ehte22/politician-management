import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const navigation = [
    { name: 'Dashboard', href: '/', icon: PlusCircleIcon, current: false },
    { name: 'Users', href: '/users', icon: PlusCircleIcon, current: false },
    { name: 'Calender', href: '/calender', icon: PlusCircleIcon, current: false },
]

const Sidebar = ({ toggleSidebar, userData }) => {

    const tabView = window.innerWidth < 1024

    const handleToggleSideBar = () => {
        if (tabView) {
            toggleSidebar()
        }
    }

    return <>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 w-80 h-screen fixed scrollbar-hide">
            <div className="flex h-16 shrink-0 items-center">
                <span className='text-white'>LOGO</span>
            </div>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1" >
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        onClick={handleToggleSideBar}
                                        className='text-gray-400 hover:bg-gray-800 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'

                                    >
                                        <item.icon aria-hidden="true" className="size-6 shrink-0" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className="-mx-6 mt-auto">
                        <Link
                            to={`/profile/${userData?._id}`}
                            className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800"
                        >
                            <img
                                alt={userData?.firstName}
                                src={`${userData?.profile}` ? userData?.profile : "/profile.png"}
                                className="size-8 rounded-full bg-gray-800"
                            />
                            <span className="sr-only">{userData?.firstName} {userData?.lastName}</span>
                            <span aria-hidden="true">{userData?.firstName} {userData?.lastName}</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    </>
}

export default Sidebar

