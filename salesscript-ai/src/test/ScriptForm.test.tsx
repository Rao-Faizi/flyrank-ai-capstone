import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScriptForm } from '../components/ScriptForm';

describe('ScriptForm', () => {
  it('renders all required fields and labels', () => {
    render(<ScriptForm onSubmit={vi.fn()} isLoading={false} />);

    expect(screen.getByLabelText(/prospect company name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/industry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/key value points/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
  });

  it('submit button is disabled when required fields are empty', () => {
    render(<ScriptForm onSubmit={vi.fn()} isLoading={false} />);

    const button = screen.getByRole('button', { name: /generate sales script/i });
    expect(button).toBeDisabled();
  });

  it('submit button becomes enabled when all required fields are filled', () => {
    render(<ScriptForm onSubmit={vi.fn()} isLoading={false} />);

    fireEvent.change(screen.getByLabelText(/prospect company name/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/industry/i), { target: { value: 'SaaS' } });
    fireEvent.change(screen.getByLabelText(/key value points/i), { target: { value: '- Saves time' } });

    expect(screen.getByRole('button', { name: /generate sales script/i })).not.toBeDisabled();
  });

  it('calls onSubmit with correct data when submitted', () => {
    const mockSubmit = vi.fn();
    render(<ScriptForm onSubmit={mockSubmit} isLoading={false} />);

    fireEvent.change(screen.getByLabelText(/prospect company name/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/industry/i), { target: { value: 'SaaS' } });
    fireEvent.change(screen.getByLabelText(/key value points/i), { target: { value: '- Saves time' } });
    fireEvent.click(screen.getByRole('button', { name: /generate sales script/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      companyName: 'Acme Corp',
      industry: 'SaaS',
      productBullets: '- Saves time',
      yourName: undefined,
      provider: 'openai',
    });
  });

  it('shows loading state correctly', () => {
    render(<ScriptForm onSubmit={vi.fn()} isLoading={true} />);
    
    const button = screen.getByRole('button', { name: /generating via/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });
});
