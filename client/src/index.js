import {createRoot} from 'react-dom/client'
// Axios
import axios from 'axios'
/*import {Chart, registerables} from 'chart.js'
import {QueryClient, QueryClientProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'*/

/**
 * TIP: Replace this style import with rtl styles to enable rtl mode
 *
 * import './_metronic/assets/css/style.rtl.css'
 **/
import {AppRoutes} from "./routes/AppRoutes";
import {AuthProvider,setupAxios} from "./auth";
import Layout from './layouts/Layout';
/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */
/**
 * Inject Metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
setupAxios(axios)
/*Chart.register(...registerables)*/

/*const queryClient = new QueryClient()*/
const container = document.getElementById('root')
if (container) {
    createRoot(container).render(
       /* <QueryClientProvider client={queryClient}>*/
          /*  <MetronicI18nProvider>*/
                <AuthProvider>
                    <AppRoutes/>
                    <Layout/>
                </AuthProvider>

    )
}
