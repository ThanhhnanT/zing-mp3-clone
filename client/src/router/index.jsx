import LayoutDefault from "../layouts/layout"
import Home from "../pages/home/home.page"
import Topic from "../pages/topicMusic/topicMusic"
import SongTopic from "../pages/songTopic/songTopic"
import AllTopic from "../pages/topicMusic/AllTopic"
import SongDetail from "../pages/song/song"
import Logout from "../pages/logout/logout"
import PrivateRouter from "../components/PrivateRoute"
import Library from "../pages/library"
import SearchSong from "../pages/searchSong"
import UserDetail from "../pages/userDetail/index"
import Admin from "../pages/admin/main"
import AdminLogin from "../pages/admin/adminLogin"
import AdminSong from "../pages/admin/adminSong"
export const routes = [
    {
        path: "/",
        element: <LayoutDefault />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "topic/",
                element: <AllTopic />,
                children: [
                    {
                        index: true,
                        element: <Topic />
                    },
                    {
                        path: ':slugSong',
                        element: <SongTopic />
                    }
                ]
            },
            {
                path: "songs/:slugSong",
                element: <SongDetail />,
            },
            {
                path: "logout",
                element: <Logout />
            },
            {
                path: "search",
                element: <SearchSong/>
            },
            {
                path:"user-detail",
                element: <UserDetail/>
            },
            {
                element: <PrivateRouter />,
                children: [
                    {
                        path: "library/",
                        element: <Library/>
                    },
                ]
            },
            {
                path:"admin/",
                element: <Admin/>,
                children: [
                    {
                        index: true,
                        element: <AdminSong/>
                    }
                ]
            }
        ]
    },
    {
        path: "admin/login",
        element: <AdminLogin/>
    },
]