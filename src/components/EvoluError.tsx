import { useEvoluError } from "@evolu/react";
import { FC } from "react";
import Alert from '@mui/material/Alert';

export const EvoluError: FC = () => {
  const evoluError = useEvoluError();

  if (!evoluError) return null;

  return (
    <Alert severity="error">${JSON.stringify(evoluError)}</Alert>
  );
};