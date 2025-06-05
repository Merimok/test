import { describe, it, expect } from 'vitest';
import { parseGoogleHtml } from '../src/searchLayer.js';
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';

const html = readFileSync(new URL('./google-sample.html', import.meta.url));
const { window } = new JSDOM('');
global.DOMParser = window.DOMParser;

describe('parseGoogleHtml', () => {
  it('extracts titles and snippets', () => {
    const results = parseGoogleHtml(html.toString());
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('snippet');
  });
});
