
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Homepage from "./scenes/homepage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
    </Routes>
  );
}

export default App;
