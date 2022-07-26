import Main from "./pages/Main";
import Login from "./pages/Login";
import AddItem from "./pages/AddItem";
import JoinAuction from "./components/JoinAuction";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, createContext } from "react";
import { QueryClient, QueryClientProvider } from 'react-query'

export const UserContext = createContext(null); 
const queryClient = new QueryClient()

function App() { 
  const [user, setUser] = useState(null); 

  return (
    <div className="App">
      <UserContext.Provider value={{user, setUser}}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Main />}></Route>
              <Route path="/auction_session/:auctionId" element={<JoinAuction />} />
              <Route path="login" element={<Login />}></Route>
              <Route path="listing/new" element={<AddItem />}></Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </UserContext.Provider>
    </div>
  );

}

export default App;