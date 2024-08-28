<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <div class="bosch-bar"/>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="" defaultHref="/"></ion-back-button>
        </ion-buttons>
        <ion-title class="header">{{ $t( 'product.videos' ) }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="max-width">
        <div style="position:relative;padding-bottom:71.25%">
          <iframe id="kmsembed-0_wx1pxtty" width="400" height="285"
                  :src="`${this.video?.url}`"
                  class="kmsembed" allowfullscreen webkitallowfullscreen mozAllowFullScreen
                  allow="autoplay *; fullscreen *; encrypted-media *"
                  referrerPolicy="no-referrer-when-downgrade"
                  sandbox="allow-forms allow-same-origin allow-scripts allow-top-navigation allow-pointer-lock allow-popups allow-modals allow-orientation-lock allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
                  title="Kaltura Player" style="position:absolute;top:0;left:0;width:100%;height:100%">
          </iframe>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, loadingController, toastController} from '@ionic/vue';
import { useRouter } from 'vue-router';
import axios from '@/config/axios';
import i18n from '@/i18n';
import router from '@/router';

export default defineComponent({
  name: 'MedidasPage',
  components: {IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonBackButton},
  props: {
    timeout: {type: Number, default: 30000},
  },
  async mounted() {
    await this.getVideosByProduct()
  },
  data() {
    return {
      showProgressBar: true,
      showContent: false,
      video: {}
    }
  },
  setup() {
    const router = useRouter();
    return {router};
  },
  methods: {
    async getVideosByProduct() {
      await axios.get(`${process.env.VUE_APP_REMOTE_URL}/product/${this.$route.params.id}/videos`)
        .then(response => {
          this.showProgressBar = false
          this.video = response.data[0]          
        })
        .catch((e) =>{
          this.errorMessage()
          if(e.response.status === 401) {
            localStorage.removeItem('token')
            router.replace({ path: '/tabs/inicio' })  
          }      
        })
    },
    async presentLoading() {
      const loading = await loadingController
        .create({
          //cssClass: 'my-custom-class',
          message: i18n.global.t('messages.info', 'Por favor, espera...'),
          duration: this.timeout,
        });

      await loading.present();
    },
    async dismissLoading() {
      await loadingController.dismiss()
    },
    async errorMessage() {
      let toast = await toastController.create({
        message: i18n.global.t('messages.connection', 'No se ha podido cargar la información. Por favor, revise su conexión a internet y pulse aqui para volver a intentarlo.'),
        duration: 4000,
        position: 'middle'
      })
      await toast.present()
    }
  },
});
</script>
