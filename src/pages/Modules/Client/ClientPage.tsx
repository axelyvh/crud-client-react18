import { Button } from "@mui/material";
import ClientPaginatedTable from "../../../components/client/client-list";
import { useNavigate } from "react-router-dom";

const ClientPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNew = async () => {
    navigate("/new-client");
  };

  const handleExport = async () => {
    window.open("https://localhost:7117/api/Client/InboxExcel", "_blank");
  };

  return (
    <>
      <br></br>
      <Button variant="contained" color="primary" onClick={() => handleNew()}>
        Nuevo
      </Button>
      <Button variant="contained" color="info" onClick={() => handleExport()}>
        Exportar
      </Button>
      <br></br>
      <br></br>
      <ClientPaginatedTable />
    </>
  );
};

export default ClientPage;
