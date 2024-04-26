import { Route, Routes } from 'react-router-dom';
import { NotAuthorized, PageNotFound } from './pages/layout';
import { AppStarter, CarListing } from './pages/main';
import { AuthIndex, AuthStarter, Login, Register, VerifyOtp } from './pages/auth';
import { IndexPage } from './pages';

const App = () => {
  return (
    <Routes>
        <Route path="" element={<IndexPage />} />

        <Route path="/auth" element={<AuthStarter />} >
          <Route path="" index element={<AuthIndex />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-otp" element={<VerifyOtp />} />
          <Route path="login" element={<Login />} />
        </Route>

        <Route path="/app" element={<AppStarter />} >
          <Route path="" element={<CarListing />} />
        </Route>

        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;