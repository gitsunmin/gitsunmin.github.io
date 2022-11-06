import React from 'react';
import { useRecoilState } from 'recoil';
import type { WindowLocation } from '@reach/router';

import Navigation from '@src/layouts/Navigation';
import Wrapper from '@src/layouts/sandbox/Wrapper';
import Drawer from '@src/layouts/Drawer';

import { DrawerState } from '@src/store';

interface LayoutProps {
  location: WindowLocation<{ key: string; previousPath: string }>;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ location, children }) => {
  const [drawerOpen, setDrawerOpen] = useRecoilState(DrawerState);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <Navigation onClickButton={toggleDrawer} />
      <Wrapper>{children}</Wrapper>
      <Drawer open={drawerOpen} onClose={toggleDrawer} />
    </>
  );
};

export default Layout;
