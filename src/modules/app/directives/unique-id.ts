import type { Directive } from 'vue';

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

export const vUid: Directive = {
  created(el) {
    el.setAttribute('id', el.id || uid());
  },
  getSSRProps() {
    return {
      id: uid()
    };
  }
};
