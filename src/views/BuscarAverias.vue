<template>
  <ion-page>
   <HeaderPage :title="$t( 'faults.searchTitle' )"/>
    <ion-content :fullscreen="true">
      <ion-searchbar :searchIcon="this.searchIcon" show-cancel-button="never" class="no-shadow"
                     :placeholder="$t('faults.searchMessage')" v-model="textToSearch" 
                     @ionClear="this.clearSearch"/>

      <ion-progress-bar type="indeterminate" v-if="showProgressBar"/>
      <ion-button class="no-shadow" size="large" expand="full" @click="searchData()">
              <small>{{ $t( 'faults.search' ) }}</small>
      </ion-button>

      <div v-if="this.showErrorMessage" class="ion-margin ion-padding header-background no-connection-message" @click="searchData()">
        <ion-icon src="assets/icon/cloud-offline-outline.svg"/><br/>
        {{ $t( 'messages.connection' ) }}
      </div>

      <div v-show="noData" v-if="!items.length" class="ion-text-center ion-padding-horizontal">
        <p>{{ $t( 'search.noResults' ) }}</p>
      </div>

      <ion-list>
        <!--ion-item detail lines="full" v-for="(fault, index) in items" :key="index" @click="() => router.push(`/averia-detalle/${fault.id}`)"-->
        <ion-item lines="full" v-for="(fault, index) in items" :key="index" >
          <ion-label class="ion-text-wrap">
            <ion-text color="primary">
              <h3>{{ fault.code1 }}</h3>
            </ion-text>
            <ion-text>
            <p>{{ fault.definition || $t( 'faults.notDefinition') }}</p>
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
  },
  setup() {
    const router = useRouter(),
          textToSearch = ""
    return {router, textToSearch};
  },
  methods: {
    async errorMessage() {
      this.showErrorMessage = true
    },
    async searchData() {
      if (this.textToSearch.length >= 1) {
        this.showProgressBar = true;
        await axios.get(`${process.env.VUE_APP_REMOTE_URL}/faultsByProduct/${this.$route.params.productId}/${this.$route.params.powerId}/${this.$route.params.familyId}/${this.$route.params.categoryId}/${this.textToSearch}`)
          .then(response => {
            this.items = response.data
            this.showContent = true
            if (this.items) this.noData = true
            this.showErrorMessage = false
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