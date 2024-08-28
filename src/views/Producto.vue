<template>
  <ion-page>
    <ion-header class="no-border">      
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="" defaultHref="/"></ion-back-button>
        </ion-buttons>
        <ion-title class="header">{{ this.list[0].name }}</ion-title>        
      </ion-toolbar>
      <div class="bosch-bar"/>
      <ion-progress-bar type="indeterminate" v-if="showProgressBar"/>
    </ion-header>
    <ion-content :fullscreen="true">
      <div v-show="showContent">

        <div v-if="this.showErrorMessage" class="ion-margin ion-padding header-background no-connection-message" @click="loadDataProduct()">
          <ion-icon src="assets/icon/cloud-offline-outline.svg"/><br/>
          {{ $t( 'messages.connection' ) }}
        </div>

        <div class="ion-margin" v-show="showImageProducts">
          <swiper :modules="modules" class="block main-image-slider" :pagination="true">
            <swiper-slide v-for="(image, index) in imagesProduct" :key="index">
              <ion-img class="image-slider-height" :src="`${imageBaseUrl}${imageUrl}/producto/${image}`" alt=""/>
            </swiper-slide>
          </swiper>
        </div>

        <div class="ion-padding header-background">
          <span class="block ion-margin-bottom">{{ $t( 'product.name' ) + this.list[0].name  }} </span>
          <span class="block ">{{ $t( 'product.reference' ) + this.list[0].serialNumber}}</span>
        </div>
        <ion-list>
          <ion-item v-if="this.faults.length > 0" key="averias" detail lines="full" @click="() => router.push(`/buscar-averias/${this.idProduct}/${this.list[0].idPower}/${this.list.idFamily}/${this.list.idCategory}`)">
            <ion-label>{{ $t( 'product.diagnose' )}}</ion-label>
          </ion-item>

          <ion-item v-for="(imageType, index) in imagesTypes" v-show="index.toLocaleLowerCase() !== 'producto'" :key="index" detail lines="full" 
            @click="() => router.push(imageType.length > 1 ? `/images/${this.idProduct}/${this.list[0].idPower}/${this.list.idFamily}/${this.list.idCategory}/${index}` : `/image/${this.idProduct}/${this.list[0].idPower}/${this.list.idFamily}/${this.list.idCategory}/${index}`)">
            <ion-label v-if="index.toLocaleLowerCase() === 'ajustes'">Ajustes</ion-label>
            <ion-label v-if="index.toLocaleLowerCase() === 'display'">Display</ion-label>
            <ion-label v-if="index.toLocaleLowerCase() === 'control_remoto'">Control remoto</ion-label>
            <ion-label v-if="index.toLocaleLowerCase() === 'evacuaciones'">Evacuaciones</ion-label>
            <ion-label v-if="index.toLocaleLowerCase() === 'medidas'">Medidas</ion-label>
            <ion-label v-if="index.toLocaleLowerCase() === 'informacion_tecnica'">Información técnica</ion-label>
            <ion-label v-if="index.toLocaleLowerCase() === 'valores_de_sonda'">Valores de sonda</ion-label>
            <ion-label v-if="index.toLocaleLowerCase() === 'menu'">Menu</ion-label>
            <ion-label v-if="index.toLocaleLowerCase() === 'instalacion'">Instalación</ion-label>
            <ion-label v-if="index.toLocaleLowerCase() === 'conexion_termostatos'">Conexión termostatos</ion-label>
            <ion-label v-if="index.toLocaleLowerCase() === 'conexiones_electricas'">Conexiones eléctricas</ion-label>
            <ion-label v-if="index.toLocaleLowerCase() === 'calidad_del_agua'">Calidad del agua</ion-label>
            <ion-label v-if="index.toLocaleLowerCase() === 'resistencia_hidraulica'">Resistencia hidráulica</ion-label>
            <ion-label v-if="index.toLocaleLowerCase() === 'dimensiones_del_canon_del_quemador'">Dimensiones del cañón del quemador</ion-label>
          </ion-item>

          <ion-item v-for="(video, index) in videos" :key="index" detail lines="full" @click="() => openVideo(video.url)">
            <ion-label>{{ video.title ? 'Vídeo: ' + video.title : $t( 'product.video' ) + ' ' + (index + 1) }}</ion-label>
          </ion-item>

        </ion-list>

      </div>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList,
  IonItem, IonButtons, IonBackButton, IonProgressBar, IonImg, IonIcon
} from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/config/axios';
import { Pagination, Zoom } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import '@ionic/vue/css/ionic-swiper.css';
import { Browser } from '@capacitor/browser';
import router from '@/router';

export default defineComponent({
  name: 'ProductoPage',
  components: {
    IonHeader, IonToolbar, IonTitle, IonProgressBar, IonContent, Swiper, SwiperSlide,
    IonPage, IonLabel, IonList, IonImg, IonItem, IonButtons, IonBackButton, IonIcon
  },
  props: {
    timeout: {type: Number, default: 30000}
  },
  data() {

    return {
      showProgressBar: true,
      showContent: false,
      list: {0: {idPower: 0}, idFamily: 0, idCategory: 0},
      principalImageUrl: '',
      imagesTypes: {Producto: [''], producto: ['']  },
      imagesProduct: [''],
      videos: [],
      imageBaseUrl: '',
      showImageProducts: false,
      showErrorMessage: false,
      serialNumber: '',
      productData: {product: '', power: '', family: '', category: ''},
      imageUrl: '',
      faults: []
    }
  },
  async mounted() {
    this.loadDataProduct()
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const {idProduct} = route.params
    async function openVideo(urlVideo: any) {
      await Browser.open({ url: urlVideo });
    }

    return {
      router,
      idProduct,
      modules: [Pagination, Zoom],
      openVideo
    }
  },
  methods: {
    async errorMessage() {
      this.showErrorMessage = true
    },
    async loadImagesData(idProduct: any, idPower: number, idFamily: number, idCategory: number){
      await axios.get(`${process.env.VUE_APP_REMOTE_URL}/readProductImages/${idProduct}/${idPower}/${idFamily}/${idCategory}`)
        .then(response => {
          this.imagesTypes = response.data.images   
          this.productData = response.data.productData   
          this.imageUrl = response.data.imageUrl
          this.productData.category =  this.productData.category.toLocaleLowerCase()
          this.productData.family =  this.productData.family.toLocaleLowerCase()
          this.productData.power =  this.productData.power.toLocaleLowerCase()
          this.productData.product =  this.productData.product.toLocaleLowerCase()
          this.showContent = true
          this.showImageProducts = true
          this.imagesProduct = this.imagesTypes['Producto'] || this.imagesTypes['producto'];
          
        })
        .catch((e) =>{
          this.errorMessage()
          if(e.response.status === 401) {
            localStorage.removeItem('token')
            router.replace({ path: '/tabs/inicio' })  
          }      
        })
        .finally(() => this.showProgressBar = false)
    },

    async readFaults(idProduct: any, idPower: number, idFamily: number, idCategory: number){
      await axios.get(`${process.env.VUE_APP_REMOTE_URL}/faultsByProduct/${idProduct}/${idPower}/${idFamily}/${idCategory}}`)
          .then(response => {
            this.faults = response.data
            this.showContent = true
          })
          .catch((e) => {
          this.errorMessage()
          if(e.response.status === 401) {
            localStorage.removeItem('token')
            this.$router.push('inicio')
          }
        })
    },

    async loadVideosData(idProduct: any, idPower: number, idFamily: number, idCategory: number){
      await axios.get(`${process.env.VUE_APP_REMOTE_URL}/videosByProductParams/${idProduct}/${idPower}/${idFamily}/${idCategory}`)
        .then(response => {
          this.videos = response.data
          
        })
        .catch((e) =>{
          this.errorMessage()
          if(e.response.status === 401) {
            localStorage.removeItem('token')
            router.replace({ path: '/tabs/inicio' })  
          }      
        })
        .finally(() => this.showProgressBar = false)
    },
    
    async loadDataProduct(){
      this.showProgressBar = true;
      await axios.get(`${process.env.VUE_APP_REMOTE_URL}/product/${this.$route.params.idProduct}`)
        .then(response => {
          this.list = response.data; 
          this.serialNumber = response.data.serialNumber || ''  
          this.readFaults(this.$route.params.idProduct, this.list[0].idPower, this.list.idFamily, this.list.idCategory )        
          this.loadImagesData(this.$route.params.idProduct, this.list[0].idPower, this.list.idFamily, this.list.idCategory )        
          this.loadVideosData(this.$route.params.idProduct, this.list[0].idPower, this.list.idFamily, this.list.idCategory )        
          this.imagesTypes = response.data.imagesLengths;   
          this.videos = response.data.videos
          this.showErrorMessage = false
          this.imageBaseUrl = `${process.env.VUE_APP_SERVER_IMAGES}`
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
  },
});

</script>