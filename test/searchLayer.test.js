import {searchDuckDuckGo} from '../extension/scripts/searchLayer.js';
import {describe, it, expect, vi} from 'vitest';

vi.stubGlobal('fetch', vi.fn(async () => ({ok: true, json: async () => ({AbstractText: 'test', AbstractURL: 'url', Heading: 'h'})})));

describe('searchDuckDuckGo', () => {
  it('builds correct request', async () => {
    await searchDuckDuckGo('test');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('q=test'));
  });
});
