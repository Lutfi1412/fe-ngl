import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, SecretPage, DataMessege, PrivateRoutes } from "./pages";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<DataMessege />} path="/data" />
        </Route>

        <Route element={<Login />} path="/logIn2" />
        <Route path="/" element={<SecretPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
