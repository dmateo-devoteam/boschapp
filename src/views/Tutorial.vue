<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <div class="bosch-bar"/>
      <ion-toolbar>
        <ion-item class="ion-no-padding" lines="none">
          <ion-img src="assets/images/logo.png" alt="" class="header-logo"/>
          <ion-title class="header">{{ $t( 'title' ) }}</ion-title>
        </ion-item>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <swiper>
        <swiper-slide>
          <div>
            <ion-img
              src="https://www.bosch-thermotechnology.com/es/media/central_pool/global_images/bosch_stuttgart_1600x900.jpg"/>
            <p>Aquí se encuentran las categorías...</p>
            <p>{{ $t( "tutorial.intro" ) }}</p>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div>
            <ion-img
              src="https://imagenes.elpais.com/resizer/b6jjJaYs6zj4LJkIsbJ7LDPRAp8=/1960x0/arc-anglerfish-eu-central-1-prod-prisa.s3.amazonaws.com/public/DEPPWZALPDW42PQKXNML6LQUOQ.jpg"/>
            <p class="tutorial-description">{{ $t( 'tutorial.training' ) }}</p>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div>
            <ion-img
              src="https://d12mivgeuoigbq.cloudfront.net/magento-media/brand-landing-pages/2019/bosch/2019-bosch-10-12-percent-lp-header.jpg"/>
            <p class="tutorial-description">{{ $t( 'tutorial.contact' ) }}</p>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div>
            <ion-img
              src="https://s.wsj.net/public/resources/images/BN-LS842_bosch1_M_20151216061131.jpg"/>
            <p class="tutorial-description">{{ $t( 'tutorial.news' ) }}</p>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div>
            <ion-img
              src="https://cdn4.louis.de/r/b0b319679b5a11671d54e3a2b309078d51ea0b98/Bosch-MS-2800x1130-1200x484.jpg"/>
            <p class="tutorial-description">{{ $t( 'tutorial.more' ) }}</p>
            <ion-button router-link="/tabs/mas" router-direction="back" fill="clear">
              {{ $t( 'tutorial.continue' ) }}
              <ion-icon slot="end" name="arrow-forward"></ion-icon>
            </ion-button>
          </div>
        </swiper-slide>
      </swiper>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  loadingController,
  toastController,
  IonButton,
  IonIcon, IonImg, IonItem
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import i18n from "@/i18n";
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';

export default defineComponent({
  name: 'InicioPage',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonContent,
    IonPage,
    IonImg,
    IonItem,
    Swiper,
    SwiperSlide,
    IonIcon
  },
  props: {
    timeout: {type: Number, default: 30000},
  },
  methods: {
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
  data() {
    return {
      list: []
    }
  },
  async mounted() {
    localStorage.tutorialVisto = "true";
  },
  setup() {
    const router = useRouter();
    return {
      router
    };
  },
});
</script>