# Sequence Diagrams — AI-Powered Community Travel Explorer

## 1. User Registration & Login

```mermaid
sequenceDiagram
    actor U as User
    participant F as React Frontend
    participant B as Express Backend
    participant AS as AuthService
    participant DB as MongoDB

    Note over U,DB: Registration Flow
    U->>F: Fill registration form
    F->>B: POST /api/auth/register {name, email, password}
    B->>AS: register(registerDTO)
    AS->>AS: hashPassword(password)
    AS->>DB: Check if email exists
    DB-->>AS: No duplicate found
    AS->>DB: Save new User document
    DB-->>AS: User saved
    AS->>AS: generateToken(user)
    AS-->>B: {user, token}
    B-->>F: 201 {user, token}
    F->>F: Store JWT in localStorage
    F-->>U: Redirect to Dashboard

    Note over U,DB: Login Flow
    U->>F: Enter email & password
    F->>B: POST /api/auth/login {email, password}
    B->>AS: login(email, password)
    AS->>DB: Find user by email
    DB-->>AS: User document
    AS->>AS: comparePassword(input, hash)
    AS->>AS: generateToken(user)
    AS-->>B: {user, token}
    B-->>F: 200 {user, token}
    F->>F: Store JWT in localStorage
    F-->>U: Redirect to Dashboard
```

---

## 2. Upload New Place (with AI Duplicate Detection)

```mermaid
sequenceDiagram
    actor U as User
    participant F as React Frontend
    participant B as Express Backend
    participant PS as PlaceService
    participant AI as AIService
    participant CL as Cloudinary
    participant DB as MongoDB

    U->>F: Fill place form (name, location, category, photos)
    F->>B: POST /api/places {placeData, photos}
    B->>B: Verify JWT token
    B->>PS: createPlace(placeDTO)

    PS->>AI: checkDuplicate(name, location)
    AI->>DB: Query similar places by name & proximity
    DB-->>AI: Matching candidates
    AI->>AI: Calculate similarity score
    AI-->>PS: {isDuplicate: false, confidence: 0.15}

    PS->>CL: Upload photos
    CL-->>PS: Photo URLs

    PS->>DB: Save Place document
    DB-->>PS: Place saved

    PS-->>B: Place object
    B-->>F: 201 {place}
    F-->>U: Show success + place page
```

---

## 3. Write Review & Update Rating

```mermaid
sequenceDiagram
    actor U as User
    participant F as React Frontend
    participant B as Express Backend
    participant RS as ReviewService
    participant PS as PlaceService
    participant CL as Cloudinary
    participant DB as MongoDB

    U->>F: Write review (rating, text, photos)
    F->>B: POST /api/reviews {placeId, rating, text, photos}
    B->>B: Verify JWT token
    B->>RS: createReview(reviewDTO)

    opt Photos attached
        RS->>CL: Upload review photos
        CL-->>RS: Photo URLs
    end

    RS->>DB: Save Review document
    DB-->>RS: Review saved

    RS->>PS: updateAverageRating(placeId)
    PS->>DB: Aggregate ratings for place
    DB-->>PS: Average rating calculated
    PS->>DB: Update Place.averageRating
    DB-->>PS: Updated

    RS-->>B: Review object
    B-->>F: 201 {review}
    F-->>U: Show review on place page
```

---

## 4. Compare Ride Fares

```mermaid
sequenceDiagram
    actor U as User
    participant F as React Frontend
    participant B as Express Backend
    participant RS as RideService
    participant Uber as Uber API
    participant Ola as Ola API
    participant DB as MongoDB

    U->>F: Select origin & destination
    F->>B: POST /api/rides/compare {origin, destination}
    B->>B: Verify JWT token
    B->>RS: compareFares(origin, destination)

    par Fetch from providers
        RS->>Uber: GET estimate(origin, dest)
        Uber-->>RS: {fare: 250, time: 18min}
    and
        RS->>Ola: GET estimate(origin, dest)
        Ola-->>RS: {fare: 220, time: 20min}
    end

    RS->>RS: getCheapestOption(results)
    RS->>DB: Save RideComparison records
    DB-->>RS: Saved

    RS-->>B: [{provider, fare, time, isCheapest}]
    B-->>F: 200 {comparisons}
    F-->>U: Display comparison table with cheapest highlighted
```

---

## 5. Get AI Recommendations

```mermaid
sequenceDiagram
    actor U as User
    participant F as React Frontend
    participant B as Express Backend
    participant AIS as AIService
    participant AI as OpenAI/Gemini
    participant DB as MongoDB

    U->>F: Open Recommendations page
    F->>B: GET /api/recommendations
    B->>B: Verify JWT token
    B->>AIS: getRecommendations(userId)

    AIS->>DB: Fetch user preferences & history
    DB-->>AIS: User profile + past reviews

    AIS->>DB: Fetch trending places in user's city
    DB-->>AIS: Trending places

    AIS->>AI: Generate personalized recommendations
    Note right of AI: Prompt includes user prefs,<br/>history, trending places
    AI-->>AIS: Ranked place suggestions with reasons

    AIS->>DB: Save AIRecommendation records
    DB-->>AIS: Saved

    AIS-->>B: [{place, score, reason}]
    B-->>F: 200 {recommendations}
    F-->>U: Display personalized place cards
```

---

## 6. Schedule & RSVP to Group Visit

```mermaid
sequenceDiagram
    actor Creator as Creator
    actor Joiner as Joiner
    participant F as React Frontend
    participant B as Express Backend
    participant VS as VisitService
    participant DB as MongoDB

    Note over Creator,DB: Create Visit Event
    Creator->>F: Fill event form (place, date, time, max participants)
    F->>B: POST /api/visits {eventData}
    B->>B: Verify JWT token
    B->>VS: createEvent(eventDTO)
    VS->>DB: Save VisitEvent document
    DB-->>VS: Event saved
    VS-->>B: Event object
    B-->>F: 201 {event}
    F-->>Creator: Show event page

    Note over Joiner,DB: RSVP to Event
    Joiner->>F: View event & click "Going"
    F->>B: POST /api/visits/:eventId/rsvp {status: "going"}
    B->>B: Verify JWT token
    B->>VS: rsvpToEvent(eventId, userId, status)
    VS->>DB: Check current participant count
    DB-->>VS: Count < maxParticipants
    VS->>DB: Save VisitRSVP document
    DB-->>VS: RSVP saved
    VS-->>B: RSVP object
    B-->>F: 201 {rsvp}
    F-->>Joiner: Show "You're going!" confirmation
```

---

## 7. Watch & Interact with Reels

```mermaid
sequenceDiagram
    actor U as User
    participant F as React Frontend
    participant B as Express Backend
    participant ReelS as ReelService
    participant DB as MongoDB

    U->>F: Open Reels tab
    F->>B: GET /api/reels?page=1
    B->>ReelS: getFeed(page)
    ReelS->>DB: Fetch reels sorted by views/date
    DB-->>ReelS: Reel documents
    ReelS-->>B: Reel list
    B-->>F: 200 {reels}
    F-->>U: Display first reel (auto-play)

    U->>F: Swipe up (next reel)
    F->>F: Play next reel from cache

    U->>F: Tap like button
    F->>B: POST /api/reels/:id/like
    B->>ReelS: toggleLike(reelId, userId)
    ReelS->>DB: Toggle like
    DB-->>ReelS: Updated
    ReelS-->>B: {liked: true, likes: 142}
    B-->>F: 200 {liked, likes}
    F-->>U: Show filled heart + count

    U->>F: Tap save/bookmark
    F->>B: POST /api/bookmarks {reelId, type: "reel"}
    B->>DB: Save Bookmark
    DB-->>B: Saved
    B-->>F: 201 {bookmark}
    F-->>U: Show bookmarked icon
```

---

## 8. Admin Content Moderation

```mermaid
sequenceDiagram
    actor A as Admin
    participant F as React Frontend
    participant B as Express Backend
    participant AIS as AIService
    participant DB as MongoDB

    A->>F: Open Admin Dashboard
    F->>B: GET /api/admin/flags?status=pending
    B->>B: Verify JWT + Admin role
    B->>DB: Fetch pending FlagReports
    DB-->>B: Flagged content list
    B-->>F: 200 {flags}
    F-->>A: Display flagged items

    A->>F: Review flagged item
    F->>B: GET /api/admin/flags/:id/details
    B->>DB: Fetch flag + related content
    DB-->>B: Flag details + content
    B-->>F: 200 {flagDetails}
    F-->>A: Show content with context

    A->>F: Click "Remove Content"
    F->>B: PUT /api/admin/flags/:id/resolve {action: "remove"}
    B->>B: Verify Admin role
    B->>DB: Update FlagReport status to "resolved"
    B->>DB: Delete/hide flagged content
    DB-->>B: Updated
    B-->>F: 200 {resolved}
    F-->>A: Show success notification
```
