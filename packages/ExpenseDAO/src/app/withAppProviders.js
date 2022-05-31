// import createGenerateClassName from '@mui/styles/createGenerateClassName';
// import jssPreset from '@mui/styles/jssPreset';
// import { create } from 'jss';
// import jssExtend from 'jss-plugin-extend';
// import rtl from 'jss-rtl';
import Provider from 'react-redux/es/components/Provider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { StyledEngineProvider } from '@mui/material/styles';
import AppContext from './AppContext';
import routes from './fuse-configs/routesConfig';
import store from './store';
import { CeloProvider, Alfajores } from '@celo/react-celo';



const withAppProviders = (Component) => (props) => {
  const WrapperComponent = () => (
    <CeloProvider
      dapp={{
        name: 'My awesome dApp',
        description: 'My awesome description',
        url: 'https://example.com',
      }}
      network={Alfajores}
    >
    <AppContext.Provider
      value={{
        routes,
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Provider store={store}>
          <StyledEngineProvider injectFirst>
            <Component {...props} />
          </StyledEngineProvider>
        </Provider>
      </LocalizationProvider>
    </AppContext.Provider>

    </CeloProvider>
  );

  return WrapperComponent;
};

export default withAppProviders;
