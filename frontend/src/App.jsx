import { BrowserRouter , Routes , Route} from 'react-router';
import Search from './pages/Search';
import Home from './pages/Home';
import About from './pages/About';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Header from './components/Header';
import PrivateProfile from './pages/PrivateProfile';
import FooterComponent from './components/FooterComponent';
import Callback from './pages/Callback';
import PrivateRoute from './components/PrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Header/>
        <Routes>

          <Route path='/sign-in' element={<Signin />} />
          <Route path='/sign-up' element={<Signup />} />
          <Route path='/auth/callback' element={<Callback/>} />

          <Route  element={<PrivateRoute/>} >
            <Route path='/' element={<Home/>} />
            <Route path='/search' element={<Search/>} />
            <Route path='/about' element={<About />} />
            <Route path='/profile' element={<PrivateProfile />} />
            <Route path='/dashboard' element={<Dashboard />} />
          </Route>

          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path='/create-post' element={<CreatePost />} />
            <Route path='/update-post/:postId' element={<UpdatePost />} />
          </Route>

          <Route path='/projects' element={<Projects />} />
          <Route path='/post/:postSlug' element={<PostPage />} />

        </Routes>
        <FooterComponent/>
      </BrowserRouter>
    </div>
  )
}

export default App
