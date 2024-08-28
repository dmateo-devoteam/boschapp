<template>
  <ion-page class="qr-page">
    <ion-header>
      <div class="bosch-bar"></div>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="" defaultHref="/"></ion-back-button>
        </ion-buttons>
        <ion-title class="text-wrap">Escaner de código QR</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row class="scan-button">
        <ion-col>
          <ion-button expand="full" @click="cancelScan()">Cancelar</ion-button>
        </ion-col>
      </ion-row>
      <div class="scan-box"></div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import router from '@/router';

export default defineComponent({
  name: 'QrPage',
  components: {IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonBackButton, IonButtons},
  async mounted() {
    this.startScan()    
  },
  methods: {

    cancelScan() {
      this.stopScan();
      router.replace({ path: '/tabs/inicio' });
    },

    stopScan() {
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
    },

    async startScan () {
      await BarcodeScanner.checkPermission({ force: true });
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.DATA_MATRIX] });

      // if the result has content
      if (result.hasContent) {
        //alert(result.content);
        if(result.content != null && result.content != "" && result.content.length > 10){
          const ref = result.content?.substring(result.content.length - 10, result.content.length);
          router.replace('/buscar/' + ref);
        }
        
      } else {
        alert('No se han encontrado datos. Por favor, intentelo de nuevo.');
      }
    },
  },

  deactivated() {
    this.stopScan();
  },

  beforeUnmount() {
    this.stopScan();
  },

  setup() {
    const router = useRouter();
    return {router};
  }
});
</script>
