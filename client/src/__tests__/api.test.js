import axios from 'axios';
jest.mock('axios');

test('mock API call structure', () => {
  axios.get.mockResolvedValue({ data: { status: 'success' } });
  // This just proves axios is mockable for future tests
  expect(axios.get).toBeDefined();
});

test('mock POST login', () => {
  axios.post.mockResolvedValue({ data: { token: 'fake-jwt' } });
  expect(axios.post).toBeDefined();
});