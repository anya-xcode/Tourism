# ER Diagram — AI-Powered Community Travel Explorer

## Entity-Relationship Diagram

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String name
        String email UK
        String password
        String avatar
        String role "guest | user | admin"
        String[] preferences "category preferences"
        String city
        Date createdAt
        Date updatedAt
    }

    PLACE {
        ObjectId _id PK
        String name
        String description
        Float latitude
        Float longitude
        String address
        String city
        String category "Nature | Food | Heritage | Adventure | Shopping | Nightlife"
        String budgetRange "Free | Budget | Moderate | Premium"
        String operatingHours
        Int suggestedDurationMinutes
        String[] tags
        String[] photos
        Float averageRating
        Int totalReviews
        ObjectId addedBy FK
        Boolean isVerified
        Date createdAt
        Date updatedAt
    }

    REVIEW {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId placeId FK
        Int rating "1-5"
        String text
        String[] photos
        Int helpfulVotes
        Date visitDate
        Date createdAt
    }

    MEDIA {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId placeId FK
        String type "photo | video"
        String url
        String cloudinaryPublicId
        String caption
        String[] tags
        Date createdAt
    }

    REEL {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId placeId FK
        String videoUrl
        String cloudinaryPublicId
        String caption
        String thumbnailUrl
        Int views
        Int likes
        Int saves
        Date createdAt
    }

    VISIT_EVENT {
        ObjectId _id PK
        ObjectId placeId FK
        ObjectId creatorId FK
        String title
        String description
        Date scheduledDate
        String time
        Int maxParticipants
        String visibility "open | invite-only"
        String status "upcoming | completed | cancelled"
        Date createdAt
    }

    VISIT_RSVP {
        ObjectId _id PK
        ObjectId eventId FK
        ObjectId userId FK
        String status "going | maybe | declined"
        Date respondedAt
    }

    THREAD {
        ObjectId _id PK
        ObjectId placeId FK
        ObjectId userId FK
        String content
        String[] mediaUrls
        Date createdAt
    }

    THREAD_REPLY {
        ObjectId _id PK
        ObjectId threadId FK
        ObjectId userId FK
        String content
        Date createdAt
    }

    RIDE_COMPARISON {
        ObjectId _id PK
        ObjectId userId FK
        Float originLat
        Float originLng
        Float destLat
        Float destLng
        String provider "Uber | Ola | Rapido"
        Float estimatedFare
        Int estimatedMinutes
        Float distanceKm
        Date queriedAt
    }

    AI_RECOMMENDATION {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId placeId FK
        Float score
        String reason
        String type "preference | trending | similar"
        Date generatedAt
    }

    BOOKMARK {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId placeId FK
        ObjectId reelId FK
        String type "place | reel"
        Date createdAt
    }

    FLAG_REPORT {
        ObjectId _id PK
        ObjectId reportedBy FK
        String targetType "place | review | media | reel | thread"
        ObjectId targetId
        String reason
        String status "pending | reviewed | resolved"
        ObjectId resolvedBy FK
        Date createdAt
        Date resolvedAt
    }

    %% Relationships
    USER ||--o{ PLACE : "adds"
    USER ||--o{ REVIEW : "writes"
    USER ||--o{ MEDIA : "uploads"
    USER ||--o{ REEL : "creates"
    USER ||--o{ VISIT_EVENT : "organizes"
    USER ||--o{ VISIT_RSVP : "responds"
    USER ||--o{ THREAD : "posts"
    USER ||--o{ THREAD_REPLY : "replies"
    USER ||--o{ RIDE_COMPARISON : "queries"
    USER ||--o{ AI_RECOMMENDATION : "receives"
    USER ||--o{ BOOKMARK : "bookmarks"
    USER ||--o{ FLAG_REPORT : "reports"

    PLACE ||--o{ REVIEW : "has"
    PLACE ||--o{ MEDIA : "contains"
    PLACE ||--o{ REEL : "featured in"
    PLACE ||--o{ VISIT_EVENT : "hosts"
    PLACE ||--o{ THREAD : "discussed in"
    PLACE ||--o{ AI_RECOMMENDATION : "recommended"
    PLACE ||--o{ BOOKMARK : "saved as"

    VISIT_EVENT ||--o{ VISIT_RSVP : "has RSVPs"

    THREAD ||--o{ THREAD_REPLY : "has replies"
```

---

## Entity Summary

| Entity | Description | Key Relationships |
|---|---|---|
| **User** | Platform users (guest, user, admin) | Owns places, reviews, media, reels, bookmarks |
| **Place** | Community-uploaded locations | Has reviews, media, reels, events, threads |
| **Review** | Star rating + text review for a place | Belongs to User and Place |
| **Media** | Photos/videos uploaded for a place | Stored via Cloudinary |
| **Reel** | Short-form travel video clips | Tagged to a place |
| **Visit Event** | Scheduled group visit to a place | Has RSVPs from users |
| **Visit RSVP** | User response to a visit event | Links User and Event |
| **Thread** | Community discussion on a place | Has replies |
| **Thread Reply** | Response to a thread post | Belongs to Thread and User |
| **Ride Comparison** | Fare estimate query result | Links User to route |
| **AI Recommendation** | AI-generated place suggestion | Links User and Place |
| **Bookmark** | Saved place or reel | Links User to Place/Reel |
| **Flag Report** | Content moderation report | References any content type |

---

## MongoDB Collections Map

| Collection Name | Mongoose Model | Indexed Fields |
|---|---|---|
| `users` | User | email (unique), city |
| `places` | Place | city, category, location (2dsphere), tags |
| `reviews` | Review | placeId, userId, rating |
| `media` | Media | placeId, userId, type |
| `reels` | Reel | placeId, userId, views |
| `visitevents` | VisitEvent | placeId, scheduledDate, status |
| `visitrsvps` | VisitRSVP | eventId, userId |
| `threads` | Thread | placeId |
| `threadreplies` | ThreadReply | threadId |
| `ridecomparisons` | RideComparison | userId |
| `airecommendations` | AIRecommendation | userId, score |
| `bookmarks` | Bookmark | userId, type |
| `flagreports` | FlagReport | status, targetType |
