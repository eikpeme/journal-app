import { IconButton } from '@mui/material'
import { AddOutlined } from '@mui/icons-material'

import { NoteView, NothingSelectedView } from '../views'
import { JournalLayout } from '../layout/JournalLayout'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { startNewNote } from '../../store/journal/thunks'
import { red } from '@mui/material/colors'

export const JournalPage = () => {

  const { isSaving, active } = useAppSelector(state => state.journal);
  const dispatch = useAppDispatch();

  const onClickNewNote = () => {
    dispatch(startNewNote());
  }

  return (
    <JournalLayout>
      {
        Object.keys(active).length >= 1
        ? <NoteView />
        : <NothingSelectedView />
      }
      <IconButton
        disabled={ isSaving }
        onClick={ onClickNewNote }
        size='large'
        sx={{
          color: 'white',
          backgroundColor: 'error.main',
          ':hover': { backgroundColor: 'error.main', opacity: 0.9 },
          ':disabled': { backgroundColor: red.A200, opacity: 0.9 },
          position: 'fixed',
          right: 50,
          bottom: 50
        }}
      >
        <AddOutlined sx={{ fontSize: 30 }} />
      </IconButton>
    </JournalLayout>
  )
}
