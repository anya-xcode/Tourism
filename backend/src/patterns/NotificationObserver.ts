import Logger from '../config/Logger';

/**
 * Observer Pattern — Notification System
 * Implements publish-subscribe for application events.
 * Services emit events when state changes (new review, RSVP, reply).
 * Observers subscribe to specific event types and react accordingly.
 */

// ─── Event Types ──────────────────────────────────────
export enum NotificationEvent {
  NEW_REVIEW = 'new_review',
  NEW_THREAD = 'new_thread',
  NEW_REPLY = 'new_reply',
  NEW_RSVP = 'new_rsvp',
  NEW_PLACE = 'new_place',
  PLACE_UPDATED = 'place_updated',
  EVENT_CREATED = 'event_created',
  MEDIA_UPLOADED = 'media_uploaded',
}

export interface EventPayload {
  event: NotificationEvent;
  userId: string;
  data: Record<string, any>;
  timestamp: Date;
}

// ─── Observer Interface ───────────────────────────────
export interface IObserver {
  update(payload: EventPayload): void;
}

// ─── Concrete Observers ───────────────────────────────

/**
 * Logs all events to the application logger.
 */
export class LogObserver implements IObserver {
  private logger = Logger.getInstance();

  update(payload: EventPayload): void {
    this.logger.info(
      `Event: ${payload.event} | User: ${payload.userId} | Data: ${JSON.stringify(payload.data)}`,
      'NotificationObserver'
    );
  }
}

/**
 * Placeholder for future push/email notification delivery.
 * In production, this would integrate with a push service or email queue.
 */
export class PushNotificationObserver implements IObserver {
  update(payload: EventPayload): void {
    // In a real app, this would send push notifications via FCM/APNs
    // or queue emails via SendGrid/Mailgun.
    const logger = Logger.getInstance();
    logger.debug(
      `[Push] Would notify for ${payload.event} — target user: ${payload.userId}`,
      'PushNotificationObserver'
    );
  }
}

// ─── Subject (Publisher) ──────────────────────────────

/**
 * Singleton Subject — manages observer subscriptions and event emission.
 * Services call `notify()` to broadcast events to all subscribers.
 */
class NotificationSubject {
  private static instance: NotificationSubject;
  private observers: Map<NotificationEvent, IObserver[]> = new Map();
  private globalObservers: IObserver[] = [];

  private constructor() {}

  public static getInstance(): NotificationSubject {
    if (!NotificationSubject.instance) {
      NotificationSubject.instance = new NotificationSubject();
    }
    return NotificationSubject.instance;
  }

  /**
   * Subscribe to a specific event type.
   */
  public subscribe(event: NotificationEvent, observer: IObserver): void {
    if (!this.observers.has(event)) {
      this.observers.set(event, []);
    }
    this.observers.get(event)!.push(observer);
  }

  /**
   * Subscribe to ALL events.
   */
  public subscribeAll(observer: IObserver): void {
    this.globalObservers.push(observer);
  }

  /**
   * Unsubscribe from a specific event type.
   */
  public unsubscribe(event: NotificationEvent, observer: IObserver): void {
    const eventObservers = this.observers.get(event);
    if (eventObservers) {
      this.observers.set(
        event,
        eventObservers.filter((o) => o !== observer)
      );
    }
  }

  /**
   * Emit an event to all subscribed observers.
   */
  public notify(event: NotificationEvent, userId: string, data: Record<string, any>): void {
    const payload: EventPayload = {
      event,
      userId,
      data,
      timestamp: new Date(),
    };

    // Notify event-specific observers
    const eventObservers = this.observers.get(event) || [];
    eventObservers.forEach((observer) => observer.update(payload));

    // Notify global observers
    this.globalObservers.forEach((observer) => observer.update(payload));
  }
}

export default NotificationSubject;
