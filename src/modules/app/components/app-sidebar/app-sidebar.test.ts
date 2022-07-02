import { httpMock, renderWithPlugins, setDeviceWidth } from '@/__test__/utils';
import Sidebar from './app-sidebar.vue';
import { waitFor, fireEvent } from '@testing-library/vue';

type PokemonEntry = {
  name: String;
};

type RenderWithLoadedListOptions = {
  results?: PokemonEntry[];
  isDesktop?: boolean;
  isOpened?: boolean;
};

async function renderWithLoadedList({
  results = [{ name: 'foo' }],
  isDesktop = false,
  isOpened = true
}: RenderWithLoadedListOptions = {}) {
  if (isDesktop) {
    setDeviceWidth(1920);
  }

  const request = httpMock({
    url: '/pokemon-species',
    query: true,
    response: {
      count: 905,
      results
    }
  });

  const wrapper = renderWithPlugins(Sidebar, { props: { isOpened } });
  await waitFor(() => expect(request.isDone()).toBeTruthy());

  return wrapper;
}

describe('Sidebar Component', () => {
  test('should mount component', async () => {
    expect(Sidebar).toBeTruthy();
    const { html } = await renderWithLoadedList({ isDesktop: true });

    expect(html()).toMatchSnapshot();
  });

  test('should display a link to detail page for each pokemon', async () => {
    const { findByText } = await renderWithLoadedList({
      isDesktop: true
    });

    const link = await findByText('foo');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/foo');
  });

  test('should hide the list on mobile', async () => {
    const { queryByText } = await renderWithLoadedList({ isDesktop: false });
    expect(queryByText('foo')).not.toBeInTheDocument();
  });

  test('should display isOpened toggle on mobile', async () => {
    const { findByTitle } = await renderWithLoadedList({
      isDesktop: false
    });

    const toggle = await findByTitle('Hide list');
    expect(toggle).toBeInTheDocument();
  });
});
