import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LeadScoreCard } from '../LeadScoreCard';

describe('LeadScoreCard Component', () => {
  it('renders high score tier correctly', () => {
    const result = {
      companyName: 'Acme Corp',
      score: 90,
      tier: 'Tier 1 - Strategic',
      recommendation: 'Assign to Enterprise AE'
    };

    render(<LeadScoreCard result={result} />);
    
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('Tier 1 - Strategic')).toBeInTheDocument();
    expect(screen.getByText('Assign to Enterprise AE')).toBeInTheDocument();
  });

  it('renders low score tier correctly', () => {
    const result = {
      companyName: 'Small Biz',
      score: 30,
      tier: 'Tier 3 - Standard',
      recommendation: 'Nurture via email'
    };

    render(<LeadScoreCard result={result} />);
    
    expect(screen.getByText('Small Biz')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Tier 3 - Standard')).toBeInTheDocument();
    expect(screen.getByText('Nurture via email')).toBeInTheDocument();
  });
});
