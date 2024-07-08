import { useEvolu, useQuery } from '@evolu/react';
import { Database, EventId, EventType, getAllEvents } from './lib/db';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { EvoluError } from './components/EvoluError';

import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AirlineSeatReclineNormalOutlinedIcon from '@mui/icons-material/AirlineSeatReclineNormalOutlined';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Typography } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridToolbar } from '@mui/x-data-grid';
import { UserDialog } from './components/UserDialog';

const events = {
  enter: 'Eingestiegen',
  exit: 'Ausgestiegen',
  sit: 'Abgesessen',
  stand: 'Aufgestanden'
}

function App() {
  const { rows } = useQuery(getAllEvents);
  const { create, update } = useEvolu<Database>();

  function addEvent(type: EventType) {
    create('event', { type });
  }

  function deleteEvent(id: EventId) {
    update('event', { id, isDeleted: true });
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'type', headerName: 'Typ', width: 150, valueGetter: value => events[value] },
    { field: 'createdAt', type: 'dateTime', headerName: 'Erstellt', flex: 1, valueGetter: value => new Date(value), valueFormatter: (value: Date) => value.toISOString() },
    { 
      field: 'delete', 
      type: 'actions', 
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem icon={<DeleteOutlineOutlinedIcon />} onClick={() => deleteEvent(params.id as EventId)} label="Delete" />,
      ]
    }
  ];


  return (
    <Container maxWidth="sm">
      <EvoluError />
      <Typography variant='h2' gutterBottom>Event tracking</Typography>
      <Stack spacing={2}>
        <Button size='large' variant="contained" onClick={() => addEvent('enter')} startIcon={<LoginOutlinedIcon />}>Eingestiegen</Button>
        <Button size='large' variant="contained" onClick={() => addEvent('sit')} startIcon={<AirlineSeatReclineNormalOutlinedIcon />}>Abgesessen</Button>
        <Button size='large' variant="contained" onClick={() => addEvent('stand')} startIcon={<DirectionsWalkOutlinedIcon />}>Aufgestanden</Button>
        <Button size='large' variant="contained" onClick={() => addEvent('exit')} startIcon={<LogoutOutlinedIcon />}>Ausgestiegen</Button>

        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />

        <UserDialog />
      </Stack>
    </Container>
  )
}

export default App
