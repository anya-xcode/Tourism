import { BaseService } from './BaseService';
import type { ICommunityStats, IUserStats } from '../types';

/**
 * StatsService — real community and per-user counts.
 */
class StatsServiceClass extends BaseService {
  constructor() {
    super('/stats');
  }

  public async getCommunity(): Promise<ICommunityStats> {
    return this.get<ICommunityStats>('');
  }

  public async getMine(): Promise<IUserStats> {
    return this.get<IUserStats>('/me');
  }
}

/** Singleton instance */
export const StatsService = new StatsServiceClass();
