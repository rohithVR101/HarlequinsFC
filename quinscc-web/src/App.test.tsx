import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
  it('renders main application container', () => {
    render(
      <MantineProvider>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </MantineProvider>
    );

    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
