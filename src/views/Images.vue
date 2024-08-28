<template>
  <ion-page>
    
    <!-- <HeaderPage :title="this.$route.params.imageType?.replaceAll('_', ' ')" :show-progress-bar="this.showProgressBar"/> -->
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

    <ion-content :fullscreen="true" v-show="showContent">

      <div class="ion-padding header-background">
        <ion-label class="ion-text-wrap">
          <p>Pulse en una imagen para ampliar.</p>
        </ion-label>
      </div>

      <div v-if="this.showErrorMessage" class="ion-margin ion-padding header-background no-connection-message" @click="getImagenes()">
        <ion-icon src="assets/icon/cloud-offline-outline.svg"/><br/>
        {{ $t( 'messages.connection' ) }}
      </div>
      
      <ion-grid>
        <ion-row>
          <ion-col 
            v-for="(image, index) in imagesByProduct[this.$route.params.imageType]" 
            :key="index" 
            @click="() => router.push(`/image/${this.$route.params.productId}/${this.$route.params.powerId}/${this.$route.params.familyId}/${this.$route.params.categoryId}/${this.$route.params.imageType}/${image}`)" 
            size="6"
          >
            <img :src="`${imageBaseUrl}${this.imageUrl}/${this.$route.params.imageType}/${image}`" @error="undisplayBrokedImages"/>
          </ion-col>
        </ion-row>
      </ion-grid>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { useRouter } from 'vue-router';
import axios from '@/config/axios';
import HeaderPage from '@/components/Header.vue';
import router from '@/router';

export default defineComponent({
  name: 'ImagesPage',
  components: {HeaderPage, IonContent, IonPage, IonGrid, IonRow, IonCol},
  data() {

    return {
      showProgressBar: true,
      showContent: false,
      imageType: '',
      imagesByProduct: [],
      imageBaseUrl: '',
      imageTypeTitle: '',
      showErrorMessage: false,
      productData:{product: '', power: '', fmaily: '', category: ''},
      imageUrl: ''
    }
  },
  async mounted() {
    await this.getImagenes()
  },
  setup() {
    const router = useRouter();
    return {
      router, modules: [IonGrid, IonRow, IonCol]
    };
  },
    methods: {
    undisplayBrokedImages(event: any){
      event.target.parentNode.style.display = 'none'
    },
    async getImagenes(){
      await axios.get(`${process.env.VUE_APP_REMOTE_URL}/readProductImages/${this.$route.params.productId}/${this.$route.params.powerId}/${this.$route.params.familyId}/${this.$route.params.categoryId}`)
      .then(response => {
        this.imagesByProduct = response.data.images,
        this.productData = response.data.productData,
        this.imageUrl = response.data.imageUrl
        this.imageBaseUrl = `${process.env.VUE_APP_SERVER_IMAGES}`
        this.showErrorMessage = false
        this.showContent = true   
      })
      .catch((e) =>{
          this.errorMessage()
          if(e.response?.status === 401) {
            localStorage.removeItem('token')
            router.replace({ path: '/tabs/inicio' })  
          }      
        })
      .finally(() => this.showProgressBar = false)
    },
    async errorMessage() {
      this.showErrorMessage = true;
    }
  },
});
</script>