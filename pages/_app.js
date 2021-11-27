import { Provider } from 'next-auth/client'
import Navbar from '../components/Navbar'
import '../styles/globals.css'
import '../components/Navbar/Navbar.css'
import '../components/Cards/Cards.css'
import '../components/Modal/Modal.css'
import '../components/AddEntry/AddEntry.css'
import '../components/Dashboard/Dashboard.css'
import '../components/Blog/Blog.css'

import React, { useEffect } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';

// NProgress.configure({ showSpinner: true });

function MyApp({ Component, pageProps }) {
  useEffect(()=>{
    //Binding events. 
    Router.events.on('routeChangeStart', () => NProgress.start());
    Router.events.on('routeChangeComplete', () => NProgress.done());
    Router.events.on('routeChangeError', () => NProgress.done());
    
    return () => {
      Router.events.off('routeChangeStart', () => NProgress.start());
      Router.events.off('routeChangeComplete', () => NProgress.done());
      Router.events.off('routeChangeError', () => NProgress.done());
    }
  },[])

  return (
    <Provider session={pageProps.session}>
      <Navbar />
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
