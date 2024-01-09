import { Helmet } from 'react-helmet'

export interface GoogleTagManagerInjectionProps {
  script: 'script' | 'noscript'
}

const GoogleTagManagerInjection: React.FC<GoogleTagManagerInjectionProps> = ({ script }) => {
  if (script === 'noscript') {
    // Google Tag Manager code for PROD
    if (import.meta.env.VITE_PUBLIC_APP_ENVIRONMENT === 'PROD') {
      return (
        <noscript id="tag-manager-prod-ns">
          {`<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-58HD2HQW"
            height="0" width="0" style="display:none;visibility:hidden">`}
        </noscript>
      )
    }

    //Google Tag Manager code for DEV and SANDBOX
    return (
      <noscript id="tag-manager-dev-ns">
        {`<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KBPCZJKM"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`}
      </noscript>
    )
  } else {
    // Google Tag Manager code for PROD
    if (import.meta.env.VITE_PUBLIC_APP_ENVIRONMENT === 'PROD') {
      return (
        <Helmet>
          <script id="tag-manager-prod">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-58HD2HQW');`}
          </script>
        </Helmet>
      )
    }

    //Google Tag Manager code for DEV and SANDBOX
    return (
      <Helmet>
        <script id="tag-manager-dev">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KBPCZJKM');`}
        </script>
      </Helmet>
    )
  }
}

export default GoogleTagManagerInjection
