import * as utils from '../_utils';

describe('system utilities', () => {
  describe('generateKeys', () => {
    it('defaults to c3-d5', () => {
      const keys = utils.generateKeys();
      expect(keys[0].id).toBe('C3');
      expect(keys[15].id).toBe('D5');
    });
    it('accepts custom range', () => {
      const keys = utils.generateKeys(1);
      expect(keys[0].id).toBe('C1');
      expect(keys[15].id).toBe('D3');
    });
  });
});
