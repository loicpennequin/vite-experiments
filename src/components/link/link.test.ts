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

  test('should prefetch data on hover', async () => {
    expect(Link).toBeTruthy();

    vi.mock('../../api/pokemon.api', () => ({
      getPokemonByName: vi.fn(() => 'stub')
    }));

    const { getByText } = renderWithPlugins(Link, {
      slots: { default: 'Pikachu' },
      props: {
        prefetch: true,
        to: { name: 'Detail', params: { name: 'pikachu' } }
      }
    });

    const link = getByText('Pikachu');
    vi.useFakeTimers();

    await fireEvent.mouseEnter(link);
    vi.runAllTimers();

    expect(pokemonApi.getPokemonByName).toHaveBeenCalled();
    vi.clearAllMocks();
  });
});
