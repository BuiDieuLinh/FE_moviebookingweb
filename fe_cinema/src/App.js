import './App.css';
import React from "react";
import UserRoutes from './routes/UserRoutes';
import CinemaAuthPage from './components/user/Login';
function App() {
  return (
    <div className="App">
      <UserRoutes/>
      {/* <CinemaAuthPage/> */}
    </div>
  );
}

export default App;
