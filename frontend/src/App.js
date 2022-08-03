import Main from "./pages/Main";
import Login from "./pages/Login";
import AddItem from "./pages/AddItem";
import JoinAuction from "./components/JoinAuction";
import Credits from "./pages/Credits";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, createContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const UserContext = createContext(null);
const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App h-screen">
      <UserContext.Provider value={{ user, setUser }}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <Main />
                    <h6 className="w-full underline sticky bottom-0 text-center left-0 right-0 pb-5 text-violet-500">
                      <Link to="/credits">credits</Link>
                    </h6>
                  </div>
                }
              ></Route>
              <Route
                path="/auction_session/:auctionId"
                element={user ? <JoinAuction /> : <Navigate to="/login" />}
              />
              <Route path="login" element={<Login />}></Route>
              <Route
                path="listing/new"
                element={user ? <AddItem /> : <Navigate to="/login" />}
              ></Route>
              <Route path="/credits" element={<Credits />}></Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
