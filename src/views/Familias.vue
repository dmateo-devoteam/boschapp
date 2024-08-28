<template>
  <ion-page>
    <Header :title="$t('families.title')" :show-progress-bar="this.showProgressBar"/>
    <ion-content :fullscreen="true">

      <div v-if="this.showErrorMessage" class="ion-margin ion-padding header-background no-connection-message" @click="loadFamilies()">
        <ion-icon src="assets/icon/cloud-offline-outline.svg"/><br/>
        {{ $t( 'messages.connection' ) }}
      </div>

      <ion-list>
        <ion-item detail lines="full" v-for="(fam, index) in list" :key="index" @click="routeToItem(fam.powersCount === 1 ? `${this.productsPath}${fam.powersId}` : `${this.powersPath}${fam.id}`)">
          {{ fam.name }}
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
import Header from '@/components/Header.vue';
import router from '@/router';

export default defineComponent({
  name: 'FamiliasPage',
  components: {IonContent, IonPage, IonList, IonItem, Header, IonIcon},
  props: {timeout: {type: Number, default: 30000}},
  data() {
    return {
      powersPath: '/potencias/',
      productsPath: '/productos/',
      showProgressBar: true,
      showContent: false,
      list: [],
      showErrorMessage: false
    }
  },
  async mounted() {
    this.loadFamilies()    
  },
  methods: {
    async errorMessage() {
      this.showErrorMessage = true
    },
    async loadFamilies(){
      this.showProgressBar = true
      await axios.get(`${process.env.VUE_APP_REMOTE_URL}/category/${this.$route.params.id}/families`)
      .then(response => {
        this.list = response.data
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
    routeToItem(path: string) {
      router.push(path)
    }
  },
  setup() {
    const router = useRouter();
    return {router};
  }
});
</script>
