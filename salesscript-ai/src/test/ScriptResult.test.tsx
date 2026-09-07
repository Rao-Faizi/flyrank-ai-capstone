import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScriptResult } from '../components/ScriptResult';
import type { SalesScript } from '../types/script';

const mockScript: SalesScript = {
  subjectLine: 'Boost Acme Corp efficiency by 60%',
  openingHook: 'I noticed Acme Corp is scaling fast in the SaaS space.',
  valueProposition: 'Our platform reduces onboarding time dramatically.',
  socialProof: 'Companies like [Company X] saw results in week one.',
  callToAction: 'Would you be open to a 15-min call this week?',
};

describe('ScriptResult', () => {
  it('renders all five structured script fields', () => {
    render(<ScriptResult script={mockScript} onReset={vi.fn()} />);

    expect(screen.getByText(mockScript.subjectLine)).toBeInTheDocument();
    expect(screen.getByText(mockScript.openingHook)).toBeInTheDocument();
    expect(screen.getByText(mockScript.valueProposition)).toBeInTheDocument();
    expect(screen.getByText(mockScript.socialProof)).toBeInTheDocument();
    expect(screen.getByText(mockScript.callToAction)).toBeInTheDocument();
  });

  it('renders a "Generate Another" reset button', () => {
    render(<ScriptResult script={mockScript} onReset={vi.fn()} />);
    expect(screen.getByRole('button', { name: /generate another/i })).toBeInTheDocument();
  });

  it('renders copy buttons for each field', () => {
    render(<ScriptResult script={mockScript} onReset={vi.fn()} />);
    const copyButtons = screen.getAllByRole('button', { name: /copy/i });
    expect(copyButtons.length).toBe(5);
  });
});
