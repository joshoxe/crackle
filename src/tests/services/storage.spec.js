import { StorageService } from '../../services/storage';
import { beforeEach, describe, it, expect, vi } from 'vitest';

describe('Storage Service', () => {
  let sut;
  let mockLocalStorage;
  beforeEach(() => {
    vi.resetAllMocks();

    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    sut = new StorageService();
    global.localStorage = mockLocalStorage;
  });

  it('saveStatistics should call setItem to stats key with stats object', () => {
    const stats = { fake: 'stats' };
    sut.saveStatistics(stats);

    expect(mockLocalStorage.setItem).toBeCalledTimes(1);
    expect(mockLocalStorage.setItem).toBeCalledWith(
      'crackleStats',
      JSON.stringify(stats)
    );
  });

  it('saveState should call setItem to state key with a state object when called', () => {
    const state = { fake: 'state' };
    sut.saveState(state);

    expect(mockLocalStorage.setItem).toBeCalledTimes(1);
    expect(mockLocalStorage.setItem).toBeCalledWith(
      'crackleCurrentState',
      JSON.stringify(state)
    );
  });
});
