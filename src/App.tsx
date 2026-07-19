// ── App — React Router with catch-all route ──

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TerminalApp } from './components';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<TerminalApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
