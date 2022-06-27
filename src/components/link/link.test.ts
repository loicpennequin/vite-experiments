import { fireEvent } from '@testing-library/vue';
import { renderWithPlugins } from '../../__test__/utils';
import Link from './link.vue';
import * as pokemonApi from '../../api/pokemon.api';

describe('Link Component', () => {
  test('should mount component', async () => {
    expect(Link).toBeTruthy();

    const { html } = renderWithPlugins(Link, {
      slots: { default: 'I am a link' },
      props: { to: { name: 'Home' } }
    });
    expect(html()).toMatchSnapshot();
  });
});
