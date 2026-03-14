import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LiveSearch from './LiveSearch';

describe('LiveSearch Component', () => {
  it('updates input value immediately while typing', () => {
    const onSearch = vi.fn();
    render(<LiveSearch onSearch={onSearch} />);
    
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'react' } });
    
    expect(input.value).toBe('react');
  });

  it('calls onSearch after debounce delay', async () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<LiveSearch onSearch={onSearch} />);
    
    const input = screen.getByPlaceholderText(/search/i);
    
    // Clear the initial mount call
    onSearch.mockClear();

    fireEvent.change(input, { target: { value: 'vite' } });
    
    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onSearch).toHaveBeenCalledWith('vite');
    vi.useRealTimers();
  });

  it('clears input when clear button is clicked', () => {
    const onSearch = vi.fn();
    render(<LiveSearch initialValue="test" onSearch={onSearch} />);
    
    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    
    const input = screen.getByPlaceholderText(/search/i);
    expect(input.value).toBe('');
  });
});
