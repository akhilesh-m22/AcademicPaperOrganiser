import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationScreen from "./screens/RegistrationScreen";
import LoginScreen from "./screens/LoginScreen";
import AdminLoginScreen from "./screens/AdminLoginScreen";
import AdminDashboard from "./screens/AdminDashboard";
import UserDashboard from "./screens/userDashboard";
import AddPaper from "./screens/addPaperScreen";
import MyPapers from "./screens/userPapersScreen";
import PaperDetails from "./screens/paperDetailsScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegistrationScreen />} />
                <Route path="/admin/login" element={<AdminLoginScreen />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/add-paper" element={<AddPaper />} />
                <Route path="/my-papers" element={<MyPapers />} />
                <Route path="/papers/:id" element={<PaperDetails />} />
                <Route path="/analytics" element={<AnalyticsScreen />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
