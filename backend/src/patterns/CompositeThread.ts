/**
 * Composite Pattern — Thread & Reply Hierarchy
 * Treats individual replies and threads with nested replies uniformly.
 * A thread is a composite of replies, and each can be rendered/counted the same way.
 */
export interface IThreadComponent {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  getContent(): string;
  getChildCount(): number;
  toJSON(): object;
}

/**
 * Leaf — a single reply with no children
 */
export class ReplyLeaf implements IThreadComponent {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: Date;

  constructor(id: string, content: string, userId: string, userName: string, createdAt: Date) {
    this.id = id;
    this.content = content;
    this.userId = userId;
    this.userName = userName;
    this.createdAt = createdAt;
  }

  getContent(): string {
    return this.content;
  }

  getChildCount(): number {
    return 0;
  }

  toJSON(): object {
    return {
      id: this.id,
      content: this.content,
      userId: this.userId,
      userName: this.userName,
      createdAt: this.createdAt,
      replyCount: 0,
    };
  }
}

/**
 * Composite — a thread that contains replies (children)
 */
export class ThreadComposite implements IThreadComponent {
  id: string;
  content: string;
  userId: string;
  userName: string;
  placeId: string;
  mediaUrls: string[];
  createdAt: Date;
  private children: IThreadComponent[] = [];

  constructor(
    id: string,
    content: string,
    userId: string,
    userName: string,
    placeId: string,
    mediaUrls: string[],
    createdAt: Date
  ) {
    this.id = id;
    this.content = content;
    this.userId = userId;
    this.userName = userName;
    this.placeId = placeId;
    this.mediaUrls = mediaUrls;
    this.createdAt = createdAt;
  }

  add(component: IThreadComponent): void {
    this.children.push(component);
  }

  remove(componentId: string): void {
    this.children = this.children.filter((c) => c.id !== componentId);
  }

  getContent(): string {
    return this.content;
  }

  getChildCount(): number {
    return this.children.reduce((count, child) => count + 1 + child.getChildCount(), 0);
  }

  getChildren(): IThreadComponent[] {
    return this.children;
  }

  toJSON(): object {
    return {
      id: this.id,
      content: this.content,
      userId: this.userId,
      userName: this.userName,
      placeId: this.placeId,
      mediaUrls: this.mediaUrls,
      createdAt: this.createdAt,
      replyCount: this.getChildCount(),
      replies: this.children.map((c) => c.toJSON()),
    };
  }
}
