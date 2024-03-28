import { TurnedInNot } from '@mui/icons-material'
import { Grid, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Note } from '../types'
import { useMemo } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setActiveNote } from '../../store/journal/journalSlice';

interface SideBarItemProps {
  note: Note;
}

export const SideBarItem = ({ note: { title, body, id, date, imageUrls } }:SideBarItemProps) => {

  const dispatch = useAppDispatch();

  const onSelectNote = () => {
    dispatch(setActiveNote({ title, body, id, date, imageUrls }));
  }

  const newTitle = useMemo(() => {
    return title.length > 17
      ? title.substring(0, 17) + '...'
      : title;
  }, [title])

  return (
    <ListItem key={ id } disablePadding onClick={ onSelectNote }>
      <ListItemButton>
        <ListItemIcon>
          <TurnedInNot />
        </ListItemIcon>
        <Grid container>
          <ListItemText primary={ newTitle } />
          <ListItemText secondary={ body } />
        </Grid>
      </ListItemButton>
    </ListItem>
  )
}
