import nock from 'nock';
import {
  httpMock,
  renderWithPlugins,
  setDeviceWidth
} from '../../__test__/utils';
import Sidebar from './sidebar.vue';
import { waitFor, fireEvent } from '@testing-library/vue';

type PokemonEntry = {
  name: String;
};

type RenderWithLoadedListOptions = {
  results?: PokemonEntry[];
  isDesktop?: boolean;
};

async function renderWithLoadedList({
  results = [{ name: 'foo' }],
  isDesktop = false
}: RenderWithLoadedListOptions = {}) {
  if (isDesktop) {
    setDeviceWidth(1920);
  }

  const scope = httpMock({
    url: '/pokemon?limit=50&offset=0',
    response: {
      count: 50,
      results
    }
  });

  expect(Sidebar).toBeTruthy();

  const wrapper = renderWithPlugins(Sidebar);
  await waitFor(() => expect(scope.isDone()).toBeTruthy());

  return wrapper;
}

describe('Sidebar Component', () => {
  test('should mount component', async () => {
    const { html } = await renderWithLoadedList({ isDesktop: true });

    expect(html()).toMatchSnapshot();
  });

  test('should display a link to detail page for each pokemon', async () => {
    const { getByText } = await renderWithLoadedList({ isDesktop: true });

    const link = getByText('foo');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/foo');
  });

  test('should hide the list on mobile', async () => {
    const { queryByText } = await renderWithLoadedList({ isDesktop: false });

    expect(queryByText('foo')).not.toBeInTheDocument();
  });

  test('should display list toggle on mobile', async () => {
    const { getByTitle, queryByText } = await renderWithLoadedList({
      isDesktop: false
    });

    const toggle = getByTitle('Show list');
    expect(toggle).toBeInTheDocument();
  });

  test('should display/hide list when clicking on the toggle', async () => {
    const { getByTitle, queryByText } = await renderWithLoadedList({
      isDesktop: false
    });

    const toggle = getByTitle('Show list');

    await fireEvent.click(toggle);
    const link = queryByText('foo');

    expect(link).toBeInTheDocument();
    expect(toggle).toHaveAttribute('title', 'Hide list');

    await fireEvent.click(toggle);

    expect(link).not.toBeInTheDocument();
    expect(toggle).toHaveAttribute('title', 'Show list');
  });
});
