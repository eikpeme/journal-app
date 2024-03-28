import { LogoutOutlined, MenuOutlined } from '@mui/icons-material'
import { AppBar, Grid, IconButton, Toolbar, Typography } from '@mui/material'
import { useAppDispatch } from '../../store/hooks';
import { startSignOutUser } from '../../store/auth';

interface NavBarProps {
  drawerWidth: number;
}

export const NavBar = ({ drawerWidth = 240 }:NavBarProps) => {

  const dispatch = useAppDispatch();

  const onLogout = () => {
    dispatch(startSignOutUser());
  }

  return (
    <AppBar
      position='fixed'
      sx={{
        width: { sm: `calc(100% - ${ drawerWidth }px)` },
        ml: { sm: `${ drawerWidth }px` }
      }}
    >
      <Toolbar>
        <IconButton
          color='inherit'
          edge='start'
          sx={{ mr: 2, display: { sm: 'none' } }} 
        >
          <MenuOutlined />
        </IconButton>

        <Grid
          container
          direction='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography variant='h6' noWrap component='div'>JournalApp</Typography>
          <IconButton color='error' onClick={ onLogout }>
            <LogoutOutlined />
          </IconButton>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}
