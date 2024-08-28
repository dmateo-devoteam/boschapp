<template>
  <ion-page>
    <ion-header class="ion-no-border">      
      <ion-toolbar>
        <ion-title class="header">{{$t( 'news.title' )}}</ion-title>        
      </ion-toolbar>
      <div class="bosch-bar"/>
      <ion-progress-bar type="indeterminate" v-if="showProgressBar"/>
    </ion-header>
    <ion-content :fullscreen="true">

      <div v-if="this.showErrorMessage" class="ion-margin ion-padding header-background no-connection-message" @click="getNews()">
        <ion-icon src="assets/icon/cloud-offline-outline.svg"/><br/>
        {{ $t( 'messages.connection' ) }}
      </div>

      <ion-card v-for="(news, index) in items" :key="index" @click="this.getNewDetail(news.id)">
        <ion-card-header>
          <ion-img :src="`${this.image}${news.nameFile}`" alt=""/>
          <ion-card-title class="ion-text-justify">{{ news.title }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-card-subtitle class="primary date-news" style="display:none">{{ news.updatedAt.date }}</ion-card-subtitle>
          <p class="ion-text-justify ion-margin-bottom wrap-text">{{ news.description }}</p>
        </ion-card-content>
      </ion-card>
<!-- #CH para que el botón siga apareciendo una vez pulsado
      <ion-button v-if="!this.noData" expand="full" class="more-content-btn no-shadow" @click="loadMoreNews">{{
          $t( 'news.more_news' )
        }}
      </ion-button>
-->
      <ion-button expand="full" class="more-content-btn no-shadow" @click="loadMoreNews">{{
          $t( 'news.more_news' )
        }}
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonPage, IonContent, IonButton, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle,
  IonCardTitle, toastController, IonImg, IonHeader, IonTitle, IonToolbar, IonIcon, IonProgressBar
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import axios from '@/config/axios';
import i18n from "@/i18n";
import router from '@/router';

export default defineComponent({
  name: 'NoticiasPage',
  components: {
    IonContent, IonPage, IonButton, IonCard, IonImg, IonCardHeader, IonIcon, 
    IonCardContent, IonCardSubtitle, IonCardTitle, IonHeader, IonTitle, IonToolbar, IonProgressBar
  },
  props: {
    timeout: {type: Number, default: 30000},
  },
  data() {
    return {
      showProgressBar: true,
      showContent: false,
      noData: false,
      items: [],
      pageNumber: 1,
      showErrorMessage: false,
      image: '',
      /*todayDate: new Date(),
      dateToday: ''*/
    }
  },
  async mounted() {
    // await this.presentLoading()
    await this.getNews()
  },
  methods: {
    async getNews() {
      this.showProgressBar = true
      await axios.get(`${process.env.VUE_APP_REMOTE_URL}/news/${this.pageNumber}`)
      // await axios.get(`${process.env.VUE_APP_REMOTE_URL}/news/${this.pageNumber}`)
        .then(response => {
          this.items = response.data

          /*this.dateToday = (this.todayDate.getFullYear() + '-' + ((this.todayDate.getMonth() + 1)) + 
            '-' + this.todayDate.getDate() + ' ' +this.todayDate.getHours() + ':' + this.todayDate.getMinutes()+ ':' + this.todayDate.getSeconds());*/

          this.image = `${process.env.VUE_APP_SERVER_IMAGES}`
          this.showContent = true
          this.showErrorMessage = false
          this.pageNumber++
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
    async getNewDetail(id:number) {
      await router.push(`/noticia-detalle/${id}`)
    },
    async loadMoreNews() {
      this.showProgressBar = true
      await axios.get(`${process.env.VUE_APP_REMOTE_URL}/news/${this.pageNumber++}`)
        .then(response => {
          if(response.data.length) {
            this.items = this.items.concat(response.data)
            this.showContent = true
            this.showErrorMessage = false
          }
          else {
            this.noData = true
            this.noMoreDataMessage()
          }
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
    async noMoreDataMessage(){
      let toast = await toastController.create({
        message: i18n.global.t('news.no_more',  'No hay más noticias'),
        position:'middle',
        cssClass: 'modalFormat',
        color: 'primary',
        duration: 3000
      })
      return await toast.present()
    },
    async errorMessage() {
      this.showErrorMessage = true
    }
  },
  setup() {
    const router = useRouter();
    return {
      router
    };
  },
});
</script>