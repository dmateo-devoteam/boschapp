import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import '@/theme/global.scss';
import '@/theme/variables.scss';
import '@/theme/header.scss';
import '@/theme/body.scss';
import '@/theme/footer.scss';

/* import i18n file */
import i18n from '@/i18n/index'
import OneSignal from 'onesignal-cordova-plugin';


// Call this function when your app starts
function OneSignalInit(): void {
  // Uncomment to set OneSignal device logging to VERBOSE  
  // OneSignal.setLogLevel(6, 0);

  // NOTE: Update the setAppId value below with your OneSignal AppId.

  OneSignal.setAppId(process.env.VUE_APP_ONE_SIGNAL_APP_ID);
  //OneSignal.setAppId('d68f89af-a9db-40bd-9601-f822c3098eee');
  
  OneSignal.setNotificationOpenedHandler(() => {
  //OneSignal.setNotificationOpenedHandler(function(jsonData) {
      // console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  });

  // Prompts the user for notification permissions.
  //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
  OneSignal.promptForPushNotificationsWithUserResponse(() => {
  // OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
      // console.log("User accepted notifications: " + accepted);
  });
}
document.addEventListener("deviceready", OneSignalInit, false);


const app = createApp(App)
app.use(i18n)
app.use(IonicVue)
app.use(router)
router.isReady().then(() => {
  app.mount('#app');
});
