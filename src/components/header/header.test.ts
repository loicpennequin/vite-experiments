import { renderWithPlugins } from '../../__test__/utils';
import Header from './header.vue';

describe('Header Component', () => {
  test('should mount component', async () => {
    expect(Header).toBeTruthy();

    const { html } = renderWithPlugins(Header);
    expect(html()).toMatchSnapshot();
  });

  test('should have link to home page', async () => {
    const { getByText } = renderWithPlugins(Header);

    const link = getByText('Pokédex');
    expect(link).toHaveAttribute('href', '/');
  });
});
