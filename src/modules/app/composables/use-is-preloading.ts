import { inject, Ref } from 'vue';
import { IS_PRELOADING_INJECTION_KEY } from '@/constants';

export const useIsPreloading = () =>
  inject<Ref<boolean>>(IS_PRELOADING_INJECTION_KEY) as Ref<boolean>;
