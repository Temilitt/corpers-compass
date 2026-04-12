import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Submit from "./pages/Submit";
import PPADetail from "./pages/PPADetail";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/ppa/:id" element={<PPADetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}