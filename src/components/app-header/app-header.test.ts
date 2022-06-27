import { renderWithPlugins } from '../../__test__/utils';
import AppHeader from './app-header.vue';

describe('Header Component', () => {
  test('should mount component', async () => {
    expect(AppHeader).toBeTruthy();

    const { html } = renderWithPlugins(AppHeader);
    expect(html()).toMatchSnapshot();
  });

  test('should have link to home page', async () => {
    const { getByText } = renderWithPlugins(AppHeader);

    const link = getByText('Pokédex');
    expect(link).toHaveAttribute('href', '/');
  });
});
