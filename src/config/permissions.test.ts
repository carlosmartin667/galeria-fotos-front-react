import { describe, expect, it } from 'vitest';
import { canAccessAdmin, canAccessUserArea, canUseDevTools, canViewAudit, canViewPrivateDownloads } from './permissions';

describe('permissions', () => {
  it('permite admin en areas administrativas', () => {
    expect(canAccessAdmin(['Admin'])).toBe(true);
    expect(canViewAudit(['Admin'])).toBe(true);
    expect(canUseDevTools(['Admin'])).toBe(true);
  });

  it('permite usuario/cliente en area de usuario', () => {
    expect(canAccessUserArea(['Usuario'])).toBe(true);
    expect(canAccessUserArea(['Cliente'])).toBe(true);
    expect(canViewPrivateDownloads(['Cliente'])).toBe(true);
    expect(canAccessAdmin(['Cliente'])).toBe(false);
  });
});
