import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBanner } from '../components/ErrorBanner';

describe('ErrorBanner', () => {
  it('renders the error message', () => {
    render(<ErrorBanner message="Something went wrong." onRetry={vi.fn()} />);
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  it('has role="alert" for screen reader accessibility', () => {
    render(<ErrorBanner message="Error!" onRetry={vi.fn()} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders a retry button', () => {
    const onRetry = vi.fn();
    render(<ErrorBanner message="Error!" onRetry={onRetry} />);
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});
