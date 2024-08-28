<template>
  <ion-page>
   <HeaderPage :title="$t( 'home.search' )"/>
    <ion-content :fullscreen="true">
      <ion-searchbar :searchIcon="this.searchIcon" show-cancel-button="never" class="no-shadow"
                     :placeholder="$t('search.message')" v-model="textToSearch" @ionChange="searchData()"
                     @ionClear="this.clearSearch"/>

      <ion-progress-bar type="indeterminate" v-if="showProgressBar"/>

      <div v-if="this.showErrorMessage" class="ion-margin ion-padding header-background no-connection-message" @click="searchData()">
        <ion-icon src="assets/icon/cloud-offline-outline.svg"/><br/>
        {{ $t( 'messages.connection' ) }}
      </div>

      <div v-show="noData" v-if="!items.length" class="ion-text-center ion-padding-horizontal">
        <p>{{ $t( 'search.noResults' ) }}</p>
      </div>

      <ion-list>
        <ion-item detail lines="full" v-for="(pro, index) in items" :key="index" @click="() => router.push(`/producto/${pro.id}`)">
          <ion-label class="ion-text-wrap">
            <ion-text color="primary">
              <h3>{{ pro.name }}</h3>
            </ion-text>
            <p>{{ pro.family }} - {{ pro.power }}</p>
            <ion-text>
              <p>{{ $t( 'product.serialNumber' ) + ": " + pro.serialNumber }}</p>
            </ion-text>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonContent, IonProgressBar, IonList, IonSearchbar, IonItem, IonIcon, IonLabel, IonText} from '@ionic/vue';
import { useRouter } from 'vue-router';
import axios from '@/config/axios';
import HeaderPage from '@/components/Header.vue';

export default defineComponent({
  name: 'QrPage',
  components: {
    HeaderPage, IonContent, IonPage,
    IonSearchbar, IonProgressBar, IonList, IonItem, IonIcon, IonText, IonLabel
  },
  data() {
    return {
      searchIcon: 'assets/icon/search.svg',
      showProgressBar: true,
      showContent: false,
      noData: false,
      items: [],
      maxPages: 1,
      itemCount: 20,
      showErrorMessage: false
    }
  },
  async mounted() {
    this.showProgressBar = false;
    this.textToSearch = this.$route.params.reference.toString() 
    this.searchData()
  },
  setup() {
    const router = useRouter(),
          textToSearch = ""
    /*const startScan = async () => {
      BarcodeScanner.hideBackground(); // make background of WebView transparent

      const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

      // if the result has content
      if (result.hasContent) {
        console.log(result.content); // log the raw scanned content
        alert(result.content);
      }
    };*/
    return {router, textToSearch};
  },
  methods: {
    async errorMessage() {
      this.showErrorMessage = true
    },
    async searchData() {
      if (this.textToSearch.length > 2) {
        this.showProgressBar = true;
        await axios.get(`${process.env.VUE_APP_REMOTE_URL}/productByName/${this.textToSearch}`)
          .then(response => {
            this.items = response.data
            this.showContent = true
            if (this.items) this.noData = true
            this.showErrorMessage = false
            // evt.target.complete()
            //TODO: Controlar si vienen datos en respuesta desde la API
          })
          .catch((e) => {
          this.errorMessage()
          if(e.response.status === 401) {
            localStorage.removeItem('token')
            this.$router.push('inicio')
          }
        })
          .finally(() => this.showProgressBar = false)
      }
    },
    clearSearch() {
      this.items = []
      this.noData = false
    }
  },
});
</script>
