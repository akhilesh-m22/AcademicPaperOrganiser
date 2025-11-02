import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationScreen from "./screens/registrationScreen";
import LoginScreen from "./screens/loginScreen";
import UserDashboard from "./screens/userDashboard";
import AddPaper from "./screens/addPaperScreen";
import MyPapers from "./screens/userPapersScreen";
import PaperDetails from "./screens/paperDetailsScreen";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<UserDashboard />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegistrationScreen />} />
                <Route path="/add-paper" element={<AddPaper />} />
                <Route path="/my-papers" element={<MyPapers />} />
                <Route path="/papers/:id" element={<PaperDetails />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
