<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { useI18n } from 'vue-i18n';

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  onRegistered() {
    console.log('SW registered');
  }
});

const close = async () => {
  offlineReady.value = false;
  needRefresh.value = false;
};

const { t } = useI18n();
</script>

<template>
  <ContentSurface
    v-if="offlineReady || needRefresh"
    border="solid 2 slate-300"
    bottom-0
    fixed
    m-5
    right-0
    role="alert"
    rounded
    shadow-xl
    space-y="3"
    z-1
  >
    <div class="message">
      <span v-if="offlineReady">{{ t('messages.offlineReady') }}</span>
      <span v-else>
        {{ t('messages.updateNeeded') }}
      </span>
    </div>
    <button
      v-if="needRefresh"
      border="1 current solid"
      cursor-pointer
      mr="5"
      p-3
      p-x="3"
      p-y="2"
      @click="updateServiceWorker()"
    >
      {{ t('buttonLabels.reload') }}
    </button>
    <button
      border="1 current solid"
      cursor-pointer
      p-x="3"
      p-y="2"
      @click="close"
    >
      {{ t('buttonLabels.close') }}
    </button>
  </ContentSurface>
</template>

<i18n lang="json">
{
  "en": {
    "messages": {
      "updateNeeded": "New content available, click on reload button to update.",
      "offlineReady": "App ready to work offline"
    },
    "buttonLabels": {
      "close": "Close",
      "reload": "Reload"
    }
  }
}
</i18n>
