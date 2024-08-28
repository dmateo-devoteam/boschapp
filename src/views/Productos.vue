<template>
  <ion-page>
    <HeaderPage :title="$t( 'products.title' )" :show-progress-bar="this.showProgressBar"/>
    <ion-content :fullscreen="true">

      <div v-if="this.showErrorMessage" class="ion-margin ion-padding header-background no-connection-message" @click="getProducts()">
        <ion-icon src="assets/icon/cloud-offline-outline.svg"/><br/>
        {{ $t( 'messages.connection' ) }}
      </div>      
      
      <ion-list>
        <ion-item detail lines="full" v-for="(product, index) in list" :key="index"
                  @click="() => router.push(`/producto/${product.id}`)">{{ product.name }}
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonContent, IonList, IonItem, IonIcon } from '@ionic/vue';
import { useRouter } from 'vue-router';
import axios from '@/config/axios';
import HeaderPage from '@/components/Header.vue';
import router from '@/router';

export default defineComponent({
  name: 'ProductosPage',
  components: {HeaderPage, IonContent, IonPage, IonList, IonItem, IonIcon},
  props: {
    timeout: {type: Number, default: 30000},
  },
  data() {
    return {
      showProgressBar: true,
      showContent: false,
      showErrorMessage: false,
      list: []
    }
  },
  async mounted() {
    await this.getProducts()
  },
  setup() {
    const router = useRouter();
    return {router};
  },
  methods: {
    async getProducts() {
      this.showProgressBar = true
      await axios.get(`${process.env.VUE_APP_REMOTE_URL}/power/${this.$route.params.idPower}/products`)
        .then(response => {
          this.list = response.data
          this.showErrorMessage = false
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
    async errorMessage() {
      this.showErrorMessage = true
    }
  },

});
</script>
