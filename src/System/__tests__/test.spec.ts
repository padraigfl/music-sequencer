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
  
  describe('getInitialState', () => {
    it('generates a state obect', () => {
      expect(typeof utils.getInitialState()).toBe('object');
    });
    it('includes mutable object', () => {
      const dummyObject = { obj: {}};
      const state = utils.getInitialState({ mutable: dummyObject });
      expect(state.mutable).toBe(dummyObject);
    })
  });
  
  describe('pattern updates', () => {
    const dummyState = utils.getInitialState();
  
    it('updatePatternAtIdx', () => {
      const newPattern = { drums: [], spots: [], effects: []};
      const updated = utils.updatePatternAtIdx(dummyState, newPattern, 10);
      expect(updated[10]).toBe(newPattern);
    });
  
    it(`utils.updateNoteInPattern`, () => {
      const newNote = { note: 'c2' };
      const patterns = utils.updateNoteInPattern(dummyState, newNote, 10);
      expect(patterns[0].spots[10]).toBe(newNote);
    });
  });
  
  describe('rotateBpm', () => {
    it('defaults to 80', () => {
      expect(utils.rotateBpm(0)).toBe(80);
    });
  
    it('iterates to next value if over 80 and under 320', () => {
      expect(utils.rotateBpm(80)).toBe(100);
      expect(utils.rotateBpm(100)).toBe(120);
      expect(utils.rotateBpm(120)).toBe(140);
    })
  });
});
