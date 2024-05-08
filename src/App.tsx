import React from 'react';
import { Container } from "@mui/material";
import ResponsiveAppBar from "./components/shared/AppBar";
import ClientPage from "./pages/modules/client/ClientPage";
import ClientNewPage from './pages/modules/client/ClienteNewPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <>
        <ResponsiveAppBar />
        <Container maxWidth="xl">
          <Routes>
            <Route path="/new-client" element={<ClientNewPage />} />
            <Route path="/" element={<ClientPage />} ></Route>
          </Routes>
        </Container>
      </>
    </BrowserRouter>
  );
}

export default App;