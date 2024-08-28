<template>
  <ion-page>
    <ion-header class="ion-no-border">      
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="" defaultHref="/"/>
        </ion-buttons>
        <ion-title class="header ion-text-wrap">{{ this.list.title }}</ion-title>
      </ion-toolbar>
      <div class="bosch-bar"/>
    </ion-header>
    <ion-progress-bar type="indeterminate" v-if="showProgressBar"/>
    <ion-content :fullscreen="true">

      <div v-if="this.showErrorMessage" class="ion-margin ion-padding header-background no-connection-message" @click="getNew()">
        <ion-icon src="assets/icon/cloud-offline-outline.svg"/><br/>
        {{ $t( 'messages.connection' ) }}
      </div>

      <div class="ion-padding-start ion-padding-end ion-padding-bottom">
        <ion-img :src="this.imageBaseUrl" alt=""/>
        <!--ion-icon name="share-social-outline" @click="shareApp()"></!--ion-icon-->
        <h4 class="">{{ this.list.title }}</h4>
        <ion-card-subtitle class="primary ion-margin-bottom">{{ this.date }}</ion-card-subtitle>
        <div class="ion-text-justify">{{ this.list.description }}</div>
        <ion-card-subtitle v-if="this.list.link" class="subtitle-img">
          <a :href="this.list.link" class="primary">{{ $t( 'formation.moreInfo' ) }}</a>
        </ion-card-subtitle>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonImg, IonContent,
  IonButtons, IonBackButton, IonCardSubtitle, IonProgressBar, IonIcon
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import axios from '@/config/axios';
import router from '@/router';

export default defineComponent({
  name: 'NoticiasPage',
  components: {
    IonHeader, IonToolbar, IonTitle, IonContent, IonPage,
    IonButtons, IonBackButton, IonImg, IonProgressBar, IonCardSubtitle, IonIcon
  },
  props: {
    timeout: {type: Number, default: 30000},
  },
  data() {
    return {
      imageBaseUrl: '',
      showProgressBar: true,
      showContent: false,
      showErrorMessage: false,
      list: [],
      date: ''
    }
  },
  async mounted() {
    this.getNew()
  },
  setup() {
    const router = useRouter();
    return {
      router
    };
  },
  methods: {
    async errorMessage() {
      this.showErrorMessage = true;
    },
    async getNew(){
      this.showProgressBar = true
      await axios.get(`${process.env.VUE_APP_REMOTE_URL}/new/${this.$route.params.id}`)
      .then(response => {
        this.list = response.data
        this.imageBaseUrl = `${process.env.VUE_APP_SERVER_IMAGES}${response.data.nameFile}`
        this.showErrorMessage = false
        this.showContent = true
        let formatedDate = response.data.updatedAt.date.substr(0,10)
        const formatedHour = response.data.updatedAt.date.substr(11,5)
        const dateElements = formatedDate.split('-')
        this.date = `${dateElements[2]}/${dateElements[1]}/${dateElements[0]} ${formatedHour}`      
      })
      .catch((e) =>{
          this.errorMessage()
          if(e.response.status === 401) {
            localStorage.removeItem('token')
            router.replace({ path: '/tabs/inicio' })  
          }      
        })
      .finally(() => this.showProgressBar = false)
    }
    /* shareApp() {
      Share.share({
        title: "Titulo",
        text: "Texto",
        url: 'http://ionicframework.com/',
      });
    },*/
  }
});
</script>
