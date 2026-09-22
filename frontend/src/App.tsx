import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import QuestsPage from "./pages/QuestsPage";
import AdventurersPage from "./pages/AdventurersPage";
import AdventurerDetailPage from "./pages/AdventurerDetailPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/quests" element={<QuestsPage />} />
        <Route path="/adventurers" element={<AdventurersPage />} />
        <Route path="/adventurers/:id" element={<AdventurerDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;