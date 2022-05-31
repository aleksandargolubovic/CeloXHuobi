import '@fake-db';
import BrowserRouter from '@fuse/core/BrowserRouter';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import { SnackbarProvider } from 'notistack';
import { useSelector } from 'react-redux';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { selectCurrLangDir } from 'app/store/i18nSlice';
import withAppProviders from './withAppProviders';
import { Auth } from './auth';
import { CeloProvider, Alfajores } from '@celo/react-celo';
//import '@celo/react-celo/lib/styles.css';

// import axios from 'axios';
/**
 * Axios HTTP Request defaults
 */
// axios.defaults.baseURL = "";
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const emotionCacheOptions = {
  rtl: {
    key: 'muirtl',
    stylisPlugins: [rtlPlugin],
    insertionPoint: document.getElementById('emotion-insertion-point'),
  },
  ltr: {
    key: 'muiltr',
    stylisPlugins: [],
    insertionPoint: document.getElementById('emotion-insertion-point'),
  },
};

// function WrappedApp() {
//   return (
//     <CeloProvider
//       dapp={{
//         name: 'My awesome dApp',
//         description: 'My awesome description',
//         url: 'https://example.com',
//       }}
//       network={Alfajores}
//     >
//       <App />
//     </CeloProvider>
//   );
// }


const App = () => {
  const langDirection = useSelector(selectCurrLangDir);
  

  // return (
  //   <>
  //     {address ? (
  //       <div>Connected to {address}</div>
  //     ) : (
  //       <button onClick={connect}>Connect wallet</button>
  //     )}
  //   </>

  return (
    <CacheProvider value={createCache(emotionCacheOptions[langDirection])}>
      <Auth>
        <BrowserRouter>
          <FuseAuthorization>
            <FuseTheme>
              <SnackbarProvider
                maxSnack={5}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                classes={{
                  containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
                }}
              >
                <FuseLayout />
              </SnackbarProvider>
            </FuseTheme>
          </FuseAuthorization>
        </BrowserRouter>
      </Auth>
    </CacheProvider>
  );
};

export default withAppProviders(App)();
