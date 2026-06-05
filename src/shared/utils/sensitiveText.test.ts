import { describe, expect, it } from 'vitest';
import { sanitizeSensitiveData, sanitizeSensitiveText } from './sensitiveText';

describe('sensitiveText', () => {
  it('oculta claves sensibles en texto', () => {
    const result = sanitizeSensitiveText(
      'Bearer abc.def token=secret password=hunter2 apiKey=key StorageKey=file signedUrl=https://cdn.test/a.jpg?sig=abc&x=1',
    );

    expect(result).not.toContain('abc.def');
    expect(result).not.toContain('hunter2');
    expect(result).not.toContain('key');
    expect(result).not.toContain('file');
    expect(result).not.toContain('sig=abc');
    expect(result).toContain('[redacted]');
  });

  it('oculta claves sensibles en objetos', () => {
    const result = sanitizeSensitiveData({
      token: 'abc',
      nested: { MarcaAguaStorageKey: 'private-file', ok: 'visible' },
    });

    expect(result).toEqual({
      token: '[redacted]',
      nested: { MarcaAguaStorageKey: '[redacted]', ok: 'visible' },
    });
  });
});
