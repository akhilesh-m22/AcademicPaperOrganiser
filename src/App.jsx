import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationScreen from "./screens/registrationScreen";
import LoginScreen from "./screens/loginScreen";
import UserDashboard from "./screens/userDashboard";
import AddPaper from "./screens/addPaperScreen";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<UserDashboard />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegistrationScreen />} />
                <Route path="/add-paper" element={<AddPaper />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
