import { DeleteOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material'
import { Button, Grid, IconButton, TextField, Typography } from '@mui/material'
import { ImageGallery } from '../components'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { startDeletingNote, startUpdateNote, startUploadingFiles } from '../../store/journal/thunks'
import { FormValidations, useForm } from '../../hooks'
import { Note } from '../types'
import { ChangeEvent, useEffect, useMemo, useRef } from 'react'
import Swal from 'sweetalert2'

import 'sweetalert2/dist/sweetalert2.css'

interface NoteViewValidations {
  title: [(value: string) => boolean, string];
  body: [() => boolean, string];
  date: [() => boolean, string];
  imageUrls: [() => boolean, string];
}

const noteViewValidatons: FormValidations<NoteViewValidations> = {
  title: [(value: string) => value?.length <= 1, 'Title lenght must be greather than 1'],
  body: [() => true, ''],
  date: [() => true, ''],
  imageUrls: [() => true, '']
}

export const NoteView = () => {

  const { active:note, messageSaved, isSaving } = useAppSelector(state => state.journal);
  const dispatch = useAppDispatch();

  const { title, body, date, onInputChange } = useForm(note, noteViewValidatons);

  const dateString = useMemo(() => {
    const newDate = new Date(date);
    return newDate.toUTCString();
  }, [date]);

  // useEffect(() => {
  //   dispatch(setActiveNote(active))
  // }, [formState])
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messageSaved.length > 0) {
      Swal.fire('Updated note', messageSaved, 'success');
    }
  }, [messageSaved])

  const onSaveNote = () => {
    dispatch(startUpdateNote({ title, body} as Note));
  }

  const onFileInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files?.length === 0) return;

    dispatch(startUploadingFiles(target.files!)); 
  }

  const onDelete = () => {
    dispatch(startDeletingNote());
  }

  return (
    <Grid
      className='animate__animated animate__fadeIn animate__faster'
      container direction='row' justifyContent='space-between' sx={{ mb: 1 }}>
      <Grid item>
        <Typography fontSize={30} fontWeight='light'>{ dateString }</Typography>
      </Grid>
      <Grid item>

        <input
          ref={ fileInputRef }
          type="file"
          multiple
          onChange={ onFileInputChange }
          style={{ display: 'none' }}
        />

        <IconButton
          color='primary'
          disabled={ isSaving }
          onClick={ () => fileInputRef.current!.click() }
        >
          <UploadOutlined />
        </IconButton>

        <Button
          disabled={ isSaving }
          onClick={ onSaveNote }>
          <SaveOutlined sx={{ fontSize: 30, mr: 1 }} />
          Save
        </Button>
      </Grid>

      <Grid container>
        <TextField
          type='text'
          variant='filled'
          fullWidth
          placeholder='Insert a title'
          label='Title'
          sx={{ border: 'none', mb: 1 }}
          name='title'
          value={ title }
          onChange={ onInputChange }
        />

        <TextField
          type='text'
          variant='filled'
          fullWidth
          multiline
          placeholder="What's up today?"
          minRows={ 5 }
          name='body'
          value={ body }
          onChange={ onInputChange }
        />
      </Grid>

      <Grid
        container
        justifyContent='end'
      >
        <Button
          onClick={ onDelete }
          sx={{ mt: 2 }}
          color='error'
        >
          <DeleteOutline />
          Borrar
        </Button>
      </Grid>

      <ImageGallery note={ note } />
    </Grid>
  )
}
