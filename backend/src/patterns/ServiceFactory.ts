import { AuthService } from '../services/AuthService';
import { PlaceService } from '../services/PlaceService';
import { ReviewService } from '../services/ReviewService';
import { MediaService } from '../services/MediaService';
import { ReelService } from '../services/ReelService';
import { RideService } from '../services/RideService';
import { VisitService } from '../services/VisitService';
import { ThreadService } from '../services/ThreadService';
import { NavigationService } from '../services/NavigationService';
import { BookmarkService } from '../services/BookmarkService';
import { FlagService } from '../services/FlagService';
import { AIService } from '../services/AIService';
import Logger from '../config/Logger';
import ConfigManager from '../config/ConfigManager';
import NotificationSubject, { LogObserver } from './NotificationObserver';

/**
 * Factory Pattern — Service Factory
 * Centralizes the creation of service instances.
 * Each service is lazily instantiated and cached (combines Factory + Singleton).
 */
class ServiceFactory {
  private static instance: ServiceFactory;
  private services: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  public getAuthService(): AuthService {
    return this.getOrCreate('auth', () => new AuthService());
  }

  public getPlaceService(): PlaceService {
    return this.getOrCreate('place', () => new PlaceService());
  }

  public getReviewService(): ReviewService {
    return this.getOrCreate('review', () => new ReviewService());
  }

  public getMediaService(): MediaService {
    return this.getOrCreate('media', () => new MediaService());
  }

  public getReelService(): ReelService {
    return this.getOrCreate('reel', () => new ReelService());
  }

  public getRideService(): RideService {
    return this.getOrCreate('ride', () => new RideService());
  }

  public getVisitService(): VisitService {
    return this.getOrCreate('visit', () => new VisitService());
  }

  public getThreadService(): ThreadService {
    return this.getOrCreate('thread', () => new ThreadService());
  }

  public getNavigationService(): NavigationService {
    return this.getOrCreate('navigation', () => new NavigationService());
  }

  public getBookmarkService(): BookmarkService {
    return this.getOrCreate('bookmark', () => new BookmarkService());
  }

  public getFlagService(): FlagService {
    return this.getOrCreate('flag', () => new FlagService());
  }

  public getAIService(): AIService {
    return this.getOrCreate('ai', () => new AIService());
  }

  // ─── Singleton Accessors ──────────────────────────────
  public getLogger(): Logger {
    return Logger.getInstance();
  }

  public getConfig(): ConfigManager {
    return ConfigManager.getInstance();
  }

  public getNotificationSubject(): NotificationSubject {
    return NotificationSubject.getInstance();
  }

  // ─── Initialization ───────────────────────────────────
  /**
   * Wire up default observers during app bootstrap.
   */
  public initializeObservers(): void {
    const subject = this.getNotificationSubject();
    subject.subscribeAll(new LogObserver());
    // In production, add: subject.subscribeAll(new PushNotificationObserver());
  }

  private getOrCreate<T>(key: string, factory: () => T): T {
    if (!this.services.has(key)) {
      this.services.set(key, factory());
    }
    return this.services.get(key) as T;
  }
}

export default ServiceFactory;
