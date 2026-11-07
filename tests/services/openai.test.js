import { describe, it, expect, vi, beforeEach } from 'vitest';

const run = vi.fn();
vi.mock('@profullstack/ai-providers', () => ({ getAi: () => ({ run }) }));

const { generateEssay, callAI } = await import('../../src/lib/services/openai.js');

describe('callAI (c0mpute first)', () => {
  beforeEach(() => {
    run.mockReset();
  });

  it('sends the essay prompt to c0mpute with a long timeout', async () => {
    const generate = vi.fn().mockResolvedValue({ text: 'An essay.' });
    run.mockImplementation(async (task) => ({ provider: 'c0mpute', value: await task({ name: 'c0mpute', generate }) }));
    await expect(generateEssay('Volcanoes', 200)).resolves.toBe('An essay.');
    expect(generate).toHaveBeenCalledWith(
      expect.objectContaining({ user: 'Volcanoes', maxTokens: 300, timeoutMs: 900_000 })
    );
  });

  it('uses the original OpenAI request as the fallback', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'from openai' } }] })
    });
    vi.stubGlobal('fetch', fetchMock);
    run.mockImplementation(async (task) => ({ provider: 'openai', value: await task({ name: 'openai' }) }));
    await expect(callAI('sys', 'hi', 50)).resolves.toBe('from openai');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).model).toBe('gpt-3.5-turbo');
    vi.unstubAllGlobals();
  });

  it('throws the last provider error when all fail', async () => {
    run.mockRejectedValue(Object.assign(new Error('all'), { attempts: [{ error: new Error('openai: 401') }] }));
    await expect(callAI('sys', 'hi')).rejects.toThrow('openai: 401');
  });
});
