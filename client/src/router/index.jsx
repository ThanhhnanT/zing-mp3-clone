import LayoutDefault from "../layouts/layout"
import Home from "../pages/home/home.page"
import Login from "../pages/login/login.page"
import Topic from "../pages/topicMusic/topicMusic"
import SongTopic from "../pages/songTopic/songTopic"
import AllTopic from "../pages/topicMusic/AllTopic"
import SongDetail from "../pages/song/song"
import Logout from "../pages/logout/logout"
export const routes =[
    {
        path: "/",
        element: <LayoutDefault/>,
        children:[
            {
                index: true,
                element: <Home/>
            },
            {
                path: "login/",
                element: <Login/>
            },
            {
                path: "topic/",
                element: <AllTopic/>,
                children: [
                    {
                        index: true,
                        element: <Topic/>
                    },
                    {
                        path: ':slugSong',
                        element: <SongTopic/>
                    }
                ]
            },
            {
                path: "songs/:slugSong",
                element: <SongDetail/>,
            },
            {
                path:"/logout",
                element: <Logout/>
            }
        ]
    }
]