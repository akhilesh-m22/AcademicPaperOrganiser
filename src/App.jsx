import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationScreen from "./screens/RegistrationScreen";
import LoginScreen from "./screens/LoginScreen";
import UserDashboard from "./screens/userDashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<UserDashboard />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegistrationScreen />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
