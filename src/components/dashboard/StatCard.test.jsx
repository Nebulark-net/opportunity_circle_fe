import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Activity } from 'lucide-react';
import StatCard from './StatCard';

describe('StatCard Component', () => {
  it('renders title and value correctly', () => {
    render(<StatCard title="Engagement Rate" value={2.5} icon={Activity} />);
    
    expect(screen.getByText('Engagement Rate')).toBeDefined();
    expect(screen.getByText('2.5')).toBeDefined();
  });

  it('renders loading skeleton when loading is true', () => {
    const { container } = render(<StatCard loading={true} />);
    expect(container.querySelector('.animate-pulse')).toBeDefined();
  });

  it('renders trend value when provided', () => {
    render(
      <StatCard 
        title="Test" 
        value={10} 
        icon={Activity} 
        trend="up" 
        trendValue="+12%" 
      />
    );
    expect(screen.getByText('+12%')).toBeDefined();
  });
});
