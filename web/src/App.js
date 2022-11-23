import './App.css';

import Home from './Home.js';
import { Routes, Route, BrowserRouter } from 'react-router-dom';


function App() {

  return (
    <div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;
