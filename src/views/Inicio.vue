<template>
  <ion-page>
    <!--    <Header/>-->
    <ion-header class="ion-no-border">
      <div class="bosch-bar"/>
      <ion-toolbar>
        <ion-item class="ion-no-padding ion-no-margin" lines="none">
          <ion-img src="assets/images/junkers_bosch.svg" alt="" class="header-logo"/>
          <ion-title class="ion-text-end header header-title ion-no-padding">{{ $t( 'title' ) }}</ion-title>
        </ion-item>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col class="ion-padding-top">
            <ion-label>{{ $t( 'home.infoSearch' ) }}</ion-label>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-button class="no-shadow" size="large" expand="full" @click="() => router.push('/buscar')">
              <ion-icon slot="start" src="assets/icon/search-white.svg"/>
              <small>{{ $t( 'home.search' ) }}</small>
            </ion-button>
          </ion-col>
          <ion-col>
            <ion-button class="no-shadow" size="large" expand="full" @click="() => router.push('/qr')">
              <ion-icon slot="start" src="assets/icon/qr-code.svg"/>
              <small>{{ $t( 'home.scan' ) }}</small>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-grid>
        <ion-row>
          <ion-col class="ion-padding-top">
            <ion-label>{{ $t( 'home.searchOption' ) }}</ion-label>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-progress-bar type="indeterminate" v-if="showProgressBar"/>

      <div v-if="this.showErrorMessage" class="ion-margin ion-padding header-background no-connection-message" @click="getCategories()">
        <ion-icon src="assets/icon/cloud-offline-outline.svg"/><br/>
        {{ $t( 'messages.connection' ) }}
      </div>

      <ion-list>
        <ion-item detail lines="full" v-for="(cat, index) in list" :key="index"
                  @click="() => router.push(`/familias/${cat.id}`)">{{ cat.name }}
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton, IonIcon, 
  IonGrid, IonRow, IonCol, IonLabel, IonProgressBar, IonImg
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
//import i18n from "@/i18n";

export default defineComponent({
  name: 'InicioPage',
  components: {
    // Header,
    IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonList, IonItem, IonLabel, IonButton, IonIcon, IonGrid,
    IonRow, IonCol, IonProgressBar, IonImg
  },
  props: {
    timeout: {type: Number, default: 30000},
  },
  async mounted() {
    // await this.presentLoading()
    await this.tutorialIsRevised()
    await this.login()
  },
  data() {
    return {
      showProgressBar: true,
      showContent: false,
      showErrorMessage: false,
      list: [],
      token: ''
    }
  },
  setup() {
    const router = useRouter();
    return {
      router
    };
  },
  methods: {
    async login() {
      const credentials = {
        "username": process.env.VUE_APP_USER,
        "password": process.env.VUE_APP_PASS
      }
      //TODO Gestión de errores
      await axios.post(process.env.VUE_APP_REMOTE_URL + '/auth/login', credentials)
        .then((response) => {
          this.token = response.data.token
          localStorage.setItem('token', response.data.token)
          this.getCategories()
        }).catch(() => {
          // console.log(e);
        })
    },
    async tutorialIsRevised() {
      /*let isRevised = localStorage.getItem('tutorialVisto')
      if (!isRevised) this.$router.push('/tutorial')*/
    },
     async getCategories() {
      this.showErrorMessage = false
      this.showProgressBar = true
      this.list = []
      await axios.get(
        `${process.env.VUE_APP_REMOTE_URL}/categories`, 
        {headers: {Authorization: `Bearer ${this.token}`}}
      )
        .then(response => {        
          this.list = response.data
          this.showContent = true
        })
        .catch(() => {
          this.errorMessage()
        })
        .finally(() => this.showProgressBar = false)
    },
    async errorMessage() {
      this.showErrorMessage = true;
    }
  }
});
</script>