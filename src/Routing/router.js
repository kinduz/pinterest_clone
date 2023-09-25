import About from "../Pages/About"
import Login from "../Pages/Login"
import Registration from "../Pages/Registration"
import Posts from '../Pages/Posts'
import MakePin from "../Pages/MakePin"
import CurrentPost from "../Pages/CurrentPost"
import CurrentUser from "../Pages/CurrentUser"

export const privateRoutes = [
    {path: '/posts', component: Posts, exact: true},
    {path: '/make-pin', component: MakePin, exact: true},
    {path: '/post/:id', component: CurrentPost, exact: true},
    {path: '/user/:id', component: CurrentUser, exact: true},

]

export const publicRoutes = [
    {path: '/about', component: About, exact: true},
    {path: '/login', component: Login, exact: true},
    {path: '/registration', component: Registration, exact: true},
]