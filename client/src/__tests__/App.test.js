import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

// Wrap App in MemoryRouter because you use react-router-dom
const renderApp = () => render(
  <MemoryRouter>
    <App />
  </MemoryRouter>
);

test('renders main heading', () => {
  renderApp();
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
});

test('shows login/register links when not logged in', () => {
  renderApp();
  expect(screen.getByText(/login|register|sign in/i)).toBeInTheDocument();
});

test('has navigation menu', () => {
  renderApp();
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});