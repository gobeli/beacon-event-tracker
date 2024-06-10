import { parseMnemonic, useEvolu, useOwner } from "@evolu/react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { FC, FormEvent, FormEventHandler, useState } from "react";
import { Database } from "../lib/db";

import { Effect, Exit} from 'effect'

export const UserDialog: FC = () => {
  const owner = useOwner();
  const evolu = useEvolu<Database>();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [mnemonic, setMnemonic] = useState(owner?.mnemonic as string | undefined)

  const updateOwner = async () => {
    if (!mnemonic) {
      return;
    }

    parseMnemonic(mnemonic)
      .pipe(Effect.runPromiseExit)
      .then(
        Exit.match({
          onFailure: () => setError('Mnemonic invalid'),
          onSuccess: async m => {
            await evolu.restoreOwner(m);
            setOpen(false);
          }
        })
      )
  }

  const onInput: FormEventHandler = (e: FormEvent) => {
    setMnemonic((e.target as HTMLInputElement).value);
    setError(undefined);
  }

  const onDeleteData = () => {
    evolu.resetOwner();
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant='contained' color='secondary' onClick={() => setOpen(true)}>User settings</Button>
        <Button variant='contained' color='error' onClick={() => onDeleteData()}>Daten löschen</Button>
      </Box>


      <Dialog
        maxWidth={'sm'}
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>User: {owner?.id}</DialogTitle>
        <DialogContent>
          <TextField 
            label="Key" 
            multiline={true} 
            rows={3} 
            defaultValue={mnemonic} 
            onInput={onInput} 
            fullWidth={true}
            error={!!error}
            helperText={error}
            sx={{mt: 1}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Schliessen</Button>
          <Button onClick={updateOwner}>Speichern</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}