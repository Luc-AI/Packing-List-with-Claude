import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Lists } from './pages/Lists';
import { ListDetail } from './pages/ListDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lists" element={<Lists />} />
        <Route path="/lists/:listId" element={<ListDetail />} />
        <Route path="/" element={<Navigate to="/lists" replace />} />
        <Route path="*" element={<Navigate to="/lists" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
