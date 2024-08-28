<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title class="header">{{ $t( 'more.more_information' ) }}</ion-title>
      </ion-toolbar>
      <div class="bosch-bar"/>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item lines="full" @click="() => legalInformationSite()">
          <ion-label>{{ $t( 'more.legal_information' ) }}</ion-label>
        </ion-item>
        <ion-item lines="full">
          <a class="anchor-link" :href="this.termsLink" target="blank">{{ $t( 'more.terms_of_use' ) }}</a>
        </ion-item>
        <ion-item lines="full" @click="() => dataProtectionSite()">
          <ion-label>{{ $t( 'more.data_protection' ) }}</ion-label>
        </ion-item>
        <ion-item lines="full" @click="() => legalNoticeSite()">
          <ion-label>{{ $t( 'more.legal_notices' ) }}</ion-label>
        </ion-item>
        <ion-item lines="full" class="no-display" @click="() => router.push('/tutorial')">
          <ion-label>{{ $t( 'more.tutorial' ) }}</ion-label>
        </ion-item>
        <ion-item lines="full" style="display:none">
          <ion-label>Modo oscuro</ion-label>
          <ion-toggle slot="end" @ionChange="changeDarkMode()" :checked="this.darkMode"></ion-toggle>
        </ion-item>
        <ion-item lines="full" @click="() => openSourceLicense()">
          <ion-label>{{ $t( 'more.open_source_license' ) }}</ion-label>
        </ion-item>
        <ion-item lines="full" class="secondary">
          <ion-label>{{ $t( 'more.version' ) }}: {{ VUE_APP_MODE }}</ion-label>
        </ion-item>
      </ion-list>
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
  IonList,
  IonItem,
  IonLabel,
  IonToggle
} from '@ionic/vue';
import { Browser } from '@capacitor/browser';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MasPage',
  components: {IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonList, IonItem, IonLabel, IonToggle},
  mounted() {
    this.checkMode()
  },
  data() {
    return {
      termsLink: `${process.env.VUE_APP_REMOTE_URL_RESOURCES}/pdfs/Terminos_Condiciones_Bosch_Termotechnology_actualizada__App.pdf`
    }
  },
  methods: {
    changeDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark');
      this.setTheme()
    },
    setTheme() {
      localStorage.setItem('isDarkMode', this.darkMode.toString())
    },
    checkMode() {
      const isDarkMode = localStorage.getItem('isDarkMode')
      if (isDarkMode === 'true') {
        this.darkMode = true
        //document.body.classList.toggle('dark');
      }
    }
  },
  setup() {
    const router               = useRouter(),
          VUE_APP_MODE         = process.env.VUE_APP_MODE,
          prefersDark          = window.matchMedia('(prefers-color-scheme: dark)'),
          darkMode             = prefersDark.matches,
         legalInformationSite = async () => {
           await Browser.open({url: `https://www.junkers-bosch.es/imprint/`})
          },
          termUseSite          = async () => {
            await Browser.open({url: `${process.env.VUE_APP_REMOTE_URL_RESOURCES}/pdfs/Terminos_Condiciones_Bosch_Termotechnology_actualizada__App.pdf`})
          },
          dataProtectionSite   = async () => {
            await Browser.open({url: `https://www.junkers-bosch.es/politica-de-privacidad/`})
          },
          legalNoticeSite      = async () => {
            await Browser.open({url: `${process.env.VUE_APP_BOSH_THERMOTECHNOLOGY}/es/es/residencial/aviso-legal/`})
          },
          openSourceLicense    = async () => {
            await Browser.open({url: `${process.env.VUE_APP_REMOTE_URL_RESOURCES}/pdfs/OSS-Bosch-Easypro-APP-v4.0.pdf`})
          };

    return {
      VUE_APP_MODE,
      darkMode,
      legalInformationSite,
      termUseSite,
      dataProtectionSite,
      legalNoticeSite,
      openSourceLicense,
      router
    };
  },
});
</script>
