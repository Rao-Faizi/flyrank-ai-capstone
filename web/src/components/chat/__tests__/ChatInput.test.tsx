import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ChatInput } from '../ChatInput';

describe('ChatInput Component', () => {
  it('renders correctly and allows typing', async () => {
    const mockChange = vi.fn();
    const mockSubmit = vi.fn((e) => e.preventDefault());

    render(
      <ChatInput
        input=""
        handleInputChange={mockChange}
        handleSubmit={mockSubmit}
        isLoading={false}
        isStreaming={false}
        stop={vi.fn()}
        reload={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/type a message/i);
    expect(input).toBeInTheDocument();

    const user = userEvent.setup();
    await user.type(input, 'test');
    expect(mockChange).toHaveBeenCalled();
  });

  it('disables the send button when input is empty', () => {
    render(
      <ChatInput
        input="   "
        handleInputChange={vi.fn()}
        handleSubmit={vi.fn()}
        isLoading={false}
        isStreaming={false}
        stop={vi.fn()}
        reload={vi.fn()}
      />
    );

    const button = screen.getByRole('button', { name: /send message/i });
    expect(button).toBeDisabled();
  });

  it('shows stop button when streaming', () => {
    render(
      <ChatInput
        input="test"
        handleInputChange={vi.fn()}
        handleSubmit={vi.fn()}
        isLoading={true}
        isStreaming={true}
        stop={vi.fn()}
        reload={vi.fn()}
      />
    );

    const stopBtn = screen.getByRole('button', { name: /stop generating/i });
    expect(stopBtn).toBeInTheDocument();
  });
});
