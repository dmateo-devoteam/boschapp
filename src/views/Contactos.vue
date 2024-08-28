<template>
  <ion-page>
    <ion-header class="ion-no-border">      
      <ion-toolbar>
        <ion-title class="header">{{$t( 'contact.contact' )}}</ion-title>
      </ion-toolbar>
      <div class="bosch-bar"/>
    </ion-header>
    <ion-content :fullscreen="true">
      <!--img src="https://www.boschcarservice.com/es/media/images/16_9/home/banner_elsa_1920x1080_image_640w_360h.jpg"/-->
      <ion-img src="assets/images/contact_xl.jpg"/>
      <ion-card>
        <ion-card-header>
          <ion-card-title class="header">{{ $t( 'contact.professional_attention' ) }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-card-subtitle class="ion-margin-bottom">
            <ion-icon size="small" class="icon icon-link" src="assets/icon/mail.svg"/>
            <a href="mailto:soporte.bosch-homecomfort@es.bosch.com" class="primary size location-link">soporte.bosch-homecomfort@es.bosch.com</a>
            <!--            {{ $t('contact.email') }}:-->
          </ion-card-subtitle>
          <ion-card-subtitle>
            <ion-icon size="small" class="icon icon-phone-link" src="assets/icon/call.svg"/>
            <!--            {{ $t('contact.phone') }}:-->
            <a href="tel:902410014" class="primary size location-link">902 41 00 14</a>
          </ion-card-subtitle>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title class="header">{{ $t( 'contact.general_information' ) }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-card-subtitle class="ion-margin-bottom">
            <ion-icon size="small" class="icon icon-link" src="assets/icon/mail.svg"/>
            <!--            {{ $t('contact.email') }}:-->
            <a href="mailto:atencion-clientes.bosch-homecomfort@es.bosch.com" class="primary size location-link">atencion-clientes.bosch-homecomfort@es.bosch.com</a>

          </ion-card-subtitle>
          <!--          <a href="mailto:atencion-clientes.bosch-homecomfort@es.bosch.com">atencion-clientes.bosch-homecomfort@es.bosch.com</a>-->
          <ion-card-subtitle>
            <ion-icon size="small" class="icon icon-phone-link" src="assets/icon/call.svg"/>
            <!--            {{ $t('contact.phone') }}:-->
            <a href="tel:911759092" class="primary size location-link">911 759 092</a>
          </ion-card-subtitle>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonContent, IonCard, IonCardHeader,IonCardContent,
  IonCardTitle, IonCardSubtitle, IonIcon, IonImg, IonHeader, IonTitle, IonToolbar
} from '@ionic/vue';

export default defineComponent({
  name: 'ContactosPage',
  components: {    
    IonCardSubtitle, IonContent, IonPage, IonIcon, IonImg, IonCard, IonCardHeader,
    IonCardContent, IonCardTitle, IonHeader, IonTitle, IonToolbar
  }
});
</script>
