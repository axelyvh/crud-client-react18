import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

interface Client {
  id: number;
  name: string;
  lastname: string;
  birthDateFormat: string;
  documentType: string;
  documentNumber: string;
}

const ClientPaginatedTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [data, setData] = useState<Client[]>([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, [page, perPage]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://localhost:7117/api/Client/Inbox?PageIndex=${page + 1}&PageSize=${perPage}`);
      setData(response.data.data);
      setTotalPages(response.data.count);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id: number) => {
    // Implementar lógica de edición
  };

  const handleDelete = (id: number) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.put('https://localhost:7117/api/Client/Remove', { id: deleteTargetId });
      setDeleteDialogOpen(false);
      fetchData(); // Recargar la tabla después de eliminar
    } catch (error) {
      console.error('Error al eliminar el elemento:', error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTargetId(null);
    setDeleteDialogOpen(false);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Nombres</TableCell>
              <TableCell>Apellidos</TableCell>
              <TableCell>Fecha Nacimiento</TableCell>
              <TableCell>Tipo de Documento</TableCell>
              <TableCell>N° Documento</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.id}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.lastname}</TableCell>
                <TableCell>{client.birthDateFormat}</TableCell>
                <TableCell>{client.documentType}</TableCell>
                <TableCell>{client.documentNumber}</TableCell>
                <TableCell>
                  <Button variant="contained" color='info' onClick={() => handleEdit(client.id)}>Editar</Button>
                  <Button variant="contained" color='error' onClick={() => handleDelete(client.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este cliente?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="primary">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={totalPages * perPage}
        rowsPerPage={perPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ClientPaginatedTable;
