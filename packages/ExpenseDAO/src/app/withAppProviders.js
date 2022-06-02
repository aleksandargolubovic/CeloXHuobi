import Provider from 'react-redux/es/components/Provider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { StyledEngineProvider } from '@mui/material/styles';
import AppContext from './AppContext';
import routes from './fuse-configs/routesConfig';
import store from './store';
import { CeloProvider, Alfajores, SupportedProviders } from '@celo/react-celo';


const withAppProviders = (Component) => (props) => {
  const WrapperComponent = () => (
    <CeloProvider
      dapp={{
        name: 'EXPENSE DAO',
        description: 'an Expense Management System for DAOs',
        url: 'https://expensedao.com',
      }}
      connectModal={{
        // This options changes the title of the modal and can be either a string or a react element
        title: <span>Connect your Wallet</span>,
        providersOptions: {
          // This option hides specific wallets from the default list
          hideFromDefaults: [
            SupportedProviders.MetaMask,
            SupportedProviders.PrivateKey,
            SupportedProviders.CeloExtensionWallet,
            SupportedProviders.Valora,
            SupportedProviders.Ledger,
          ],
    
          // This option hides all default wallets
          //hideFromDefaults: true,
    
          // This option toggles on and off the searchbar
          searchable: false,
        },
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
