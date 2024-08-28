<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button text="" defaultHref="/"></ion-back-button>
      </ion-buttons>
      <ion-title class="header">{{ this.title }}</ion-title>
    </ion-toolbar>
    <div class="bosch-bar"/>
    <ion-progress-bar type="indeterminate" v-if="showProgressBar"/>
  </ion-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonProgressBar } from '@ionic/vue';

export default defineComponent({
  name: "HeaderPage",
  components: {IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonProgressBar},
  props: {
    title: {
      type: String
    },
    showProgressBar: {
      type: Boolean
    }
  }
})
</script>