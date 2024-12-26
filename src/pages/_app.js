import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
      />
    </>
  );
}

export default MyApp;
