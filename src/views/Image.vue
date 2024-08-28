<template>
  <ion-page>
    <HeaderPage v-if="this.$route.params.imageType.toLocaleLowerCase() === 'ajustes'" title='Ajustes' :show-progress-bar="this.showProgressBar"/>
    <HeaderPage v-if="this.$route.params.imageType.toLocaleLowerCase() === 'control_remoto'" title='Control remoto' :show-progress-bar="this.showProgressBar"/>
    <HeaderPage v-if="this.$route.params.imageType.toLocaleLowerCase() === 'evacuaciones'" title='Evacuaciones' :show-progress-bar="this.showProgressBar"/>
    <HeaderPage v-if="this.$route.params.imageType.toLocaleLowerCase() === 'medidas'" title='Medidas' :show-progress-bar="this.showProgressBar"/>
    <HeaderPage v-if="this.$route.params.imageType.toLocaleLowerCase() === 'informacion_tecnica'" title='Información técnica' :show-progress-bar="this.showProgressBar"/>
    <HeaderPage v-if="this.$route.params.imageType.toLocaleLowerCase() === 'valores_de_sonda'" title='Valores de sonda' :show-progress-bar="this.showProgressBar"/>
    <HeaderPage v-if="this.$route.params.imageType.toLocaleLowerCase() === 'menu'" title='Menu' :show-progress-bar="this.showProgressBar"/>
    <HeaderPage v-if="this.$route.params.imageType.toLocaleLowerCase() === 'instalacion'" title='Instalación' :show-progress-bar="this.showProgressBar"/>
    <HeaderPage v-if="this.$route.params.imageType.toLocaleLowerCase() === 'conexion_termostatos'" title='Conexión termostatos' :show-progress-bar="this.showProgressBar"/>
    <HeaderPage v-if="this.$route.params.imageType.toLocaleLowerCase() === 'conexiones_electricas'" title='Conexiones eléctricas' :show-progress-bar="this.showProgressBar"/>
    <HeaderPage v-if="this.$route.params.imageType.toLocaleLowerCase() === 'calidad_del_agua'" title='Calidad del agua' :show-progress-bar="this.showProgressBar"/>
    <HeaderPage v-if="this.$route.params.imageType.toLocaleLowerCase() === 'resistencia_hidraulica'" title='Resistencia hidráulica' :show-progress-bar="this.showProgressBar"/>
    <HeaderPage v-if="this.$route.params.imageType.toLocaleLowerCase() === 'dimensiones_del_canon_del_quemador'" title='Dimensiones del cañón del quemador' :show-progress-bar="this.showProgressBar"/>
    <HeaderPage v-if="this.$route.params.imageType.toLocaleLowerCase() === 'display'" title='Display' :show-progress-bar="this.showProgressBar"/>
    <ion-content :fullscreen="true">

      <div v-if="this.showErrorMessage" class="ion-margin ion-padding header-background no-connection-message" @click="getImage()">
        <ion-icon src="assets/icon/cloud-offline-outline.svg"/><br/>
        {{ $t( 'messages.connection' ) }}
      </div>

      <!--<ion-slides zoom style="height:100%">-->
      <ion-slides zoom style="height:100%">
        <ion-slide>
          <div class="swiper-zoom-container">
            <img :src="`${imageBaseUrl}${this.imageUrl}/${this.imageTypeName}/${this.imageName}`" />
          </div>
        </ion-slide>
      </ion-slides>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonContent, IonSlides, IonSlide, IonIcon, alertController } from '@ionic/vue';
import { useRouter } from 'vue-router';
//import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import '@ionic/vue/css/ionic-swiper.css';
import axios from '@/config/axios';
import { Pagination, Zoom } from "swiper";
import HeaderPage from '@/components/Header.vue';
import router from '@/router';

export default defineComponent({
  name: 'MedidasPage',
  components: {HeaderPage, IonContent, IonPage, IonSlides, IonSlide, IonIcon},
  data() {

    return {
      showProgressBar: true,
      imageType: '',
      showContent: false,
      imageName: '',
      imageBaseUrl: '',
      showErrorMessage: false,
      imageTypeName: '',
      productData:{product: '', power: '', family: '', category: ''},
      imageUrl: ''
    }
  },
  async mounted() {
    this.getImagen()
    this.presentAlert();
  },
  setup() {
    const router = useRouter();    
    return {
      router, modules: [Pagination, Zoom]
    };
  },
  methods: {
    async getImagen(){
      await axios.get(`${process.env.VUE_APP_REMOTE_URL}/readProductImages/${this.$route.params.productId}/${this.$route.params.powerId}/${this.$route.params.familyId}/${this.$route.params.categoryId}`)
      .then(response => {
        this.imageBaseUrl = `${process.env.VUE_APP_SERVER_IMAGES}`
        this.imageTypeName = `${this.$route.params.imageType}`
        this.productData = response.data.productData  
        this.imageName = this.$route.params.imageName || response.data.images[this.imageTypeName][0]       
        this.imageUrl = response.data.imageUrl
        this.showErrorMessage = false
        this.showContent = true
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
    async presentAlert() {
      if(!localStorage.getItem('dontshowmessagezoom')){
        const alert = await alertController.create({
          header: 'Zoom',
          message: 'Puede hacer zoom en la información de la siguiente manera:<img src="assets/icon/zoom-icon.png" class="card-alert">',
          inputs: [
            {
              name: 'dontshow',
              label: 'No volver a mostrar',
              type: 'checkbox',
              value: true,
            },
          ], 
          buttons: [
          {
            text: 'OK',
            handler: (alertData) => {
              if(alertData.length != 0){
                localStorage.setItem('dontshowmessagezoom', "true")
              }
            },
          }]
        });
        await alert.present();
      }
    },
    async errorMessage() {
      this.showErrorMessage = true;
    }
  }
});
</script>