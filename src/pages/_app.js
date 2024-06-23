import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AuthConsumer, AuthProvider } from "src/contexts/auth-context";
import { useNProgress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import { createEmotionCache } from "src/utils/create-emotion-cache";
import "simplebar-react/dist/simplebar.min.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AlertModal from "src/layouts/alert/alert-modal";
import { persistor, store } from "src/redux/store/Store";
import Loading from "src/layouts/loading/Loading";

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Loading></Loading>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>DHD</title>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>
          </Head>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <AuthProvider>
              <ThemeProvider theme={theme}>
                <AlertModal></AlertModal>
                <CssBaseline />
                <AuthConsumer>
                  {(auth) =>
                    auth.isLoading ? <SplashScreen /> : getLayout(<Component {...pageProps} />)
                  }
                </AuthConsumer>
              </ThemeProvider>
            </AuthProvider>
          </LocalizationProvider>
        </CacheProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
