import React, { useState } from 'react';

import Drawer from '@src/layouts/Drawer';
import { DrawerState } from '@src/store';
import Footer from '@src/layouts/Footer';
import Header from '@src/layouts/header';
import Navigation from '@src/layouts/Navigation';
import { SiteSiteMetadata } from '@src/types/gatsby-graphql';
import type { WindowLocation } from '@reach/router';
import Wrapper from '@src/layouts/Wrapper';
import { debounce } from '@src/utils';
import { useRecoilState } from 'recoil';

interface LayoutProps {
  location: WindowLocation<{ key: string; previousPath: string }>;
  siteMetadata: SiteSiteMetadata;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ location, siteMetadata, children }) => {
  const { title } = siteMetadata;
  const [isViewsable, setIsViewsable] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useRecoilState(DrawerState);

  /**
   * * scroll이 바닥에 있을 때 Footer를 보여주기 위한 함수
   */
  const handleScroll = () => {
    if (typeof document !== 'undefined') {
      const scrollTop: number = document?.documentElement.scrollTop ?? 0;
      const offsetHeight: number = document?.documentElement.offsetHeight ?? 0;
      const clientHeight: number = document?.documentElement.clientHeight ?? 0;
      if (scrollTop + clientHeight + 200 > offsetHeight) {
        setIsViewsable(true);
      } else {
        setIsViewsable(false);
      }
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      debounce(() => {
        handleScroll();
      }, 100);
    });
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <Header title={title} location={location} />
      <Navigation onClickButton={toggleDrawer} />
      <Wrapper>{children}</Wrapper>
      {isViewsable ? <Footer /> : null}
      <Drawer open={drawerOpen} onClose={toggleDrawer} />
    </>
  );
};

export default Layout;
