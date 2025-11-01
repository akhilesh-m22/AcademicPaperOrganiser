import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationScreen from "./screens/RegistrationScreen";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RegistrationScreen />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
