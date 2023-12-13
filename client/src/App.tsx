import React, {Suspense} from 'react'
import {Outlet} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';


/*import {I18nProvider} from '../_metronic/i18n/i18nProvider'*/
import {LayoutSplashScreen} from "./layouts/LayoutSplashScreen";
/*import {MasterInit} from '../_metronic/layout/MasterInit'*/
import {AuthInit} from "./auth";
import {ToastContainer} from "react-toastify";



const App = () => {
    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
         {/*   <I18nProvider>*/}
               {/* <LayoutProvider>*/}
                    <AuthInit>
                        <Outlet/>
                       {/* <MasterInit/>*/}
                            <ToastContainer/>
                    </AuthInit>
           {/*     </LayoutProvider>*/}
           {/* </I18nProvider>*/}

        </Suspense>

    )
}

export {App}
