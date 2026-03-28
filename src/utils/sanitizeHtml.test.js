import { describe, expect, it } from 'vitest';
import { sanitizeHtml } from './sanitizeHtml';

describe('sanitizeHtml', () => {
  it('removes dangerous tags and javascript URLs while preserving safe markup', () => {
    const sanitized = sanitizeHtml(`
      <p>Safe copy</p>
      <script>alert('xss')</script>
      <a href="javascript:alert('xss')" onclick="alert('xss')">Bad link</a>
      <a href="https://example.com" target="_blank">Good link</a>
    `);

    expect(sanitized).toContain('<p>Safe copy</p>');
    expect(sanitized).not.toContain('<script');
    expect(sanitized).not.toContain('javascript:');
    expect(sanitized).not.toContain('onclick=');
    expect(sanitized).toContain('rel="noopener noreferrer"');
  });
});
