<template>
  <ion-page>
      <ion-header class="ion-no-border">        
        <ion-toolbar>
          <ion-title class="header">{{$t( 'formation.title' )}}</ion-title>
        </ion-toolbar>
        <div class="bosch-bar"/>
        <ion-progress-bar type="indeterminate" v-if="showProgressBar"/>
      </ion-header>
      <ion-content :fullscreen="true">
        <ion-col>
          <ion-button expand="full" class="more-content-btn no-shadow" @click="() => boschAcademySite()">{{
          $t( 'formation.register' )
        }}
      </ion-button>
        </ion-col>
        
        <div v-if="this.showErrorMessage" class="ion-margin ion-padding header-background no-connection-message" @click="getTrainingCenters()">
          <ion-icon src="assets/icon/cloud-offline-outline.svg"/><br/>
          {{ $t( 'messages.connection' ) }}
        </div>

        <ion-card v-for="(cent, index) in items" :key="index">
          <ion-card-header :value="cent.name">
            <ion-card-title>{{ cent.name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-img :src="`${this.image + cent.nameFile}`" alt="" class="trainingCenter-image"/>
            <ion-card-subtitle class="subtitle-img">
              <ion-icon class="icon locator-icon" src="assets/icon/locator.svg"/>
              <!--
              <a :href="`geo:${cent.latitude},${cent.longitude}?q=${cent.latitude},${cent.longitude}(${cent.name})`" class="primary location-link">

                {{ $t( 'formation.mapLink' ) }}</a>
              -->
              <a @click="() => goMaps(cent.latitude, cent.longitude, cent.name)" class="primary location-link">  {{ $t( 'formation.mapLink' ) }}</a>
                
                
            </ion-card-subtitle>
            <ion-card-subtitle v-if="cent.description" class="subtitle-img">
              <ion-icon class="icon locator-icon" src="assets/icon/globe-outline.svg"/>
              <a :href="cent.description" class="primary location-link">{{ $t( 'formation.moreInfo' ) }}</a>
            </ion-card-subtitle>
          </ion-card-content>
        </ion-card>
      </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonPage,IonContent, IonIcon, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonCard, IonImg, IonHeader, IonTitle, IonProgressBar, IonToolbar, IonCol, isPlatform
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import axios from '@/config/axios';
import { Browser } from '@capacitor/browser';

export default defineComponent({
  name: 'FormacionPage',
  components: {
    IonCardHeader, IonCardContent, IonContent, IonPage, IonIcon, IonImg, IonCardTitle, IonCardSubtitle,
    IonCard, IonHeader, IonTitle, IonProgressBar, IonToolbar, IonCol
  },
  props: {
    timeout: {type: Number, default: 30000}
  },
  data() {
    return {
      showProgressBar: true,
      showContent: false,
      showErrorMessage: false,
      image: '',
      items: []
    }
  },
  async mounted() {
    // await this.presentLoading()
    await this.getTrainingCenters()
  },
  methods: {
    async getTrainingCenters() {
      this.showProgressBar = true
      await axios.get(`${process.env.VUE_APP_REMOTE_URL}/training-centers`)
        .then(response => {
          this.items = response.data
          this.image = `${process.env.VUE_APP_SERVER_IMAGES}`
          this.showContent = true
          this.showErrorMessage = false
        })
        .catch((e) => {
          this.errorMessage()
          if(e.response.status === 401) {
            localStorage.removeItem('token')
            this.$router.push('inicio')
          }
        })
        .finally(() => this.showProgressBar = false)
    },
    async errorMessage() {
      this.showErrorMessage = true
    },
    async goMaps(latitude:any, longitude:any, nombre:any) {

      const geocoords = latitude + ',' + longitude;
      
      if (isPlatform('ios')) {
        window.open('maps://?q=' + geocoords, '_system');
      }
      else {
        const label = encodeURI(nombre);      
        window.open('geo:' + geocoords + '?q=' + geocoords + '(' + label + ')', '_system');
      }

//    await Browser.open({url: `https://www.google.com/maps/search/?api=1&query=${latitude}+${longitude}&basemap=satellite`})
           
    },
  },
  setup() {
    const router = useRouter();
    const boschAcademySite  = async () => {
            await Browser.open({url: `${process.env.VUE_APP_BOSH_ACADEMIA}/sui/`})
          };
    return {router, boschAcademySite};
  },
});
</script>
