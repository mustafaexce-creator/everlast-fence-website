import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Classifier from './pages/Classifier';
import Dashboard from './pages/Dashboard';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/classifier" element={<Classifier />} />
                <Route path="/admin" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
