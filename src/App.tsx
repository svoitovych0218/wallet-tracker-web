import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout/Layout";
import { AddWalletPage } from "./Pages/AddWalletPage";
import { TransactionHistory } from "./Pages/TransactionHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate replace to="transactions" />} />
          <Route path="add-wallet" element={<AddWalletPage />} />
          <Route path="transactions" element={<TransactionHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
