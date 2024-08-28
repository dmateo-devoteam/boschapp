<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet/>
      <ion-tab-bar class="no-border width" slot="bottom">
        <ion-tab-button class="tabBar" tab="inicio" href="/tabs/inicio">
          <ion-icon src="assets/icon/home-black.svg"/>
          <ion-label>{{ $t( 'tabs.home' ) }}</ion-label>
        </ion-tab-button>
        <ion-tab-button class="tabBar" tab="formacion" href="/tabs/formacion">
          <ion-icon src="assets/icon/book-info-black.svg"/>
          <ion-label>{{ $t( 'tabs.formation' ) }}</ion-label>
        </ion-tab-button>
        <ion-tab-button class="tabBar" tab="contactos" href="/tabs/contactos">
          <ion-icon src="assets/icon/mail-black.svg"/>
          <ion-label>{{ $t( 'tabs.contact' ) }}</ion-label>
        </ion-tab-button>
        <ion-tab-button class="tabBar" tab="noticias" href="/tabs/noticias">
          <ion-icon src="assets/icon/newspaper-black.svg"/>
          <ion-label>{{ $t( 'tabs.news' ) }}</ion-label>
        </ion-tab-button>
        <ion-tab-button class="tabBar" tab="mas" href="/tabs/mas">
          <ion-icon src="assets/icon/options-black.svg"/>
          <ion-label>{{ $t( 'tabs.more' ) }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';

export default defineComponent({
  name: 'TabsPage',
  components: {IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet},
  setup() {
    return {}
  }
});
</script>
