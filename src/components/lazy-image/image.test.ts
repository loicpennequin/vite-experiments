import { renderWithPlugins } from '../../__test__/utils';
import Image from './lazy-image.vue';

describe('Image Component', () => {
  test('should mount component', async () => {
    expect(Image).toBeTruthy();

    const { html } = renderWithPlugins(Image, {
      props: { src: '/img/my-src.png', alt: 'alt' }
    });
    expect(html()).toMatchSnapshot();
  });
});
