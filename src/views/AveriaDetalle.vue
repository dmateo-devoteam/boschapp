<template>
  <ion-page>
    <HeaderPage :title="$t( 'product.diagnose' )" :show-progress-bar="this.showProgressBar"/>
    <ion-content :fullscreen="true" v-show="showContent">

      <div v-if="this.showErrorMessage" class="ion-margin ion-padding header-background no-connection-message" @click="getData()">
        <ion-icon src="assets/icon/cloud-offline-outline.svg"/><br/>
        {{ $t( 'messages.connection' ) }}
      </div>

      <ion-list lines="full">
        <ion-item>
          <ion-label>
            <span class="boldText">Código 1: </span>{{ this.list.code1 }}
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label class="ion-text-wrap">
            <span class="boldText">Definición:</span><br/>{{ this.list.definition || $t('faults.notDefinition')}}
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonContent, IonLabel, IonList, IonItem, IonIcon } from '@ionic/vue';
import { useRouter } from 'vue-router';
import axios from '@/config/axios';
import HeaderPage from '@/components/Header.vue';
import router from '@/router';

export default defineComponent({
  name: 'AveriasPage',
  components: {HeaderPage, IonContent, IonPage, IonLabel, IonList, IonItem, IonIcon},
  props: {
    timeout: {type: Number, default: 30000},
  },
  methods: {
    async errorMessage() {
      this.showErrorMessage = true
    },
    async getAveriaDetalle(){
      this.showProgressBar = true
      await axios.get(`${process.env.VUE_APP_REMOTE_URL}/fault/${this.$route.params.id}`)
        .then(response => {
          this.list = response.data
          this.showContent = true
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
    }
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
    this.getAveriaDetalle()
  },
  setup() {
    const router = useRouter();
    return {
      router
    };
  },
});
</script>