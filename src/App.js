
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import VerifyEmailPage from './pages/Auth/VerifyEmailPage';
import MyProfile from './components/MyProfile';
import Feed from './components/Feed';
import FollowingList from './components/FollowingList';
import FollowersList from './components/FollowersList';
import ExplorePeople from './components/ExplorePeople';
import CreateProfile from './components/CreateProfile'; 
import UserDetail from './components/UserDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/following" element={<FollowingList />} />
        <Route path="/followers" element={<FollowersList />} />
        <Route path="/explore-people" element={<ExplorePeople />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/user/:id" element={<UserDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
