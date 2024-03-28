import { ReactNode } from 'react';
import { Box, Toolbar } from '@mui/material'
import { NavBar, SideBar } from '../components';

interface JournalLayoutProps {
  children: ReactNode;
}

const drawerWidth: number = 240;

export const JournalLayout = ({ children }: JournalLayoutProps) => {
  return (
    <Box sx={{ display: 'flex' }} className='animate__animated animate__fadeIn animate__faster' >
      {/* Navbar */}
      <NavBar drawerWidth={ drawerWidth } />

      {/* Sidebar */}
      <SideBar drawerWidth={ drawerWidth } />

      <Box
        component='main'
        sx={{ flexGrow: 1, p: 3 }}
      >
        <Toolbar />
        { children }
      </Box>
    </Box>
  )
}
