<template>
  <ion-page>
    <HeaderPage :title="$t( 'product.diagnose' )" :show-progress-bar="this.showProgressBar"/>
    <ion-content fullscreen>

      <div v-if="this.showErrorMessage" class="ion-margin ion-padding header-background no-connection-message" @click="getData()">
        <ion-icon src="assets/icon/cloud-offline-outline.svg"/><br/>
        {{ $t( 'messages.connection' ) }}
      </div>

      <div v-show="noData" v-if="!faults.length" class="ion-text-center ion-padding-horizontal">
        <p>{{ $t( 'search.noResults' ) }}</p>
      </div>

      <ion-list>
        <ion-item lines="full" v-for="(fault, index) in faults" :key="index" @click="() => router.push('/averia-detalle/' + fault.id)">
          <ion-label>
            <h2>{{ fault.code1 }}</h2>
            <p>{{ fault.code2 }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonIcon } from '@ionic/vue';
import { useRouter } from 'vue-router';
import axios from '@/config/axios';
import HeaderPage from '@/components/Header.vue';
import router from '@/router';

export default defineComponent({
  name: 'AveriasPage',
  components: {HeaderPage, IonContent, IonLabel, IonPage, IonList, IonItem, IonIcon},
  props: {
    timeout: {type: Number, default: 30000},
  },
  methods: {
    async errorMessage() {
      this.showErrorMessage = true
    },
    async getData(){
      this.showProgressBar = true
      await axios.get(`${process.env.VUE_APP_REMOTE_URL}/faultsByProduct/${this.$route.params.productId}/${this.$route.params.powerId}/${this.$route.params.familyId}/${this.$route.params.categoryId}`)
      .then(response => {
        this.list = response.data
        this.faults = this.list
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

    interface Fault{
      code1: string,
      code2: string
    }

    const faults: Fault[] = []

    return {
      showProgressBar: true,
      showContent: false,
      noData: false,
      faults,
      list: [],
      showErrorMessage: false
    }
  },
  async mounted() {
    this.getData()
  },
  setup() {
    const router = useRouter();
    return {
      router
    };
  },
});
</script>
