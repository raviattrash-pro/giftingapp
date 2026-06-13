# Corporate Gifting Concierge

An AI-powered, enterprise-grade personal gifting platform that seamlessly blends relationship management, advanced budget planning, and AI-driven gift recommendations.

## 📐 High-Level Design (HLD)

The application follows a modern monolithic architecture with a clear separation between the React-based frontend and the Spring Boot backend.

```mermaid
graph TD
    Client[Web Client - React/Vite] --> |HTTPS/WSS| API_Gateway[Spring Boot API Gateway / Auth]
    API_Gateway --> |REST| Auth_Service[Authentication & Authorization]
    API_Gateway --> |REST| User_Service[User & Relationship Vault]
    API_Gateway --> |REST| Gift_Service[Gift Catalog & Recommendation]
    API_Gateway --> |REST| Order_Service[Order & Checkout]
    API_Gateway --> |REST| AI_Service[AI Advisor / GiftGPT]
    
    Auth_Service --> |Read/Write| DB[(MySQL Database)]
    User_Service --> |Read/Write| DB
    Gift_Service --> |Read/Write| DB
    Order_Service --> |Read/Write| DB
    AI_Service --> |Integration| LLM_API[External LLM Provider]
```

## 🏗️ Low-Level Design (LLD)

Core entity relationships ensuring data consistency and optimal performance.

```mermaid
classDiagram
    class User {
        +Long id
        +String email
        +String role
        +List~FeatureFlag~ flags
        +register()
        +login()
    }
    class Recipient {
        +Long id
        +String name
        +String relation
        +List~Occasion~ occasions
        +addOccasion()
    }
    class Gift {
        +Long id
        +String title
        +Double price
        +String category
        +getDetails()
    }
    class Order {
        +Long id
        +Double totalAmount
        +String status
        +processPayment()
    }
    User "1" *-- "*" Recipient : manages
    User "1" *-- "*" Order : places
    Order "1" o-- "*" Gift : contains
```

## 🔄 Application Workflow

A fully functional sequence of how the application operates from user authentication to gift checkout.

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Frontend (React)
    participant Auth as Auth Service
    participant Vault as Relationship Vault
    participant AI as GiftGPT / AI Engine
    participant Checkout as Payment & Checkout

    User->>Frontend: Login/Register
    Frontend->>Auth: Authenticate
    Auth-->>Frontend: JWT Token
    User->>Frontend: Add Recipient & Occasions
    Frontend->>Vault: Save Details
    Vault-->>Frontend: Success
    User->>Frontend: Ask for Gift Recommendations
    Frontend->>AI: Send recipient profile & budget
    AI-->>Frontend: Recommended Gifts
    User->>Frontend: Select Gift & Checkout
    Frontend->>Checkout: Process Payment
    Checkout-->>Frontend: Order Confirmation
```

## ✨ In-Depth Feature Breakdown

### 1. Dashboard & Relationship Vault
The central hub of the application. It acts as a comprehensive CRM for personal relationships. Users can store details about their colleagues, clients, and loved ones, tracking important dates such as work anniversaries, birthdays, and corporate milestones.
- **Budget Planner:** Set and track your gifting budget for the fiscal year or specific periods.
- **Future Locker:** Schedule gifts to be sent in the future automatically.
- **Occasion Calendar:** A unified view of all upcoming gifting events.

![Dashboard](docs/images/dashboard.png)

### 2. AI Advisor (GiftGPT & Gift Detective)
A state-of-the-art conversational AI that acts as your personal shopping assistant.
- **GiftGPT:** Chat directly with the AI to find the perfect gift based on personality, corporate policies, and budget.
- **Gift Detective:** Unsure what to buy? Answer a few dynamic quiz questions and let the system pinpoint the optimal gift.

![AI Advisor](docs/images/ai_advisor.png)

### 3. Collaborative Gifting & Wishlists
Built for team environments where multiple people chip in for a single gift.
- **Group Gifting:** Create a collective pot. Invite contributors to add funds, track progress in real-time, and purchase a premium gift collectively.
- **Secret Santa:** Automate office gift exchanges with sophisticated matching algorithms.
- **Gift Stories:** Share the joy with an internal social feed of received and given corporate gifts.

![Group Gifting](docs/images/group_gifting.png)

### 4. Enterprise Admin Panel
A powerful backend management system accessible only to administrators.
- **Catalog Management:** Add, remove, or modify gifts.
- **Analytics:** View detailed reports on popular gifts, total spending, and user engagement.
- **Order Processing:** Track the status of deliveries and manage customer service inquiries.

### 5. Emotion & Occasion Search
An intuitive search engine that allows users to find gifts not just by category (e.g., "Mugs") but by emotion (e.g., "Gratitude", "Sympathy", "Celebration").

## 🛠️ Technology Stack
- **Frontend:** React 18, Vite, Tailwind CSS / Custom CSS, Zustand (State Management)
- **Backend:** Java 21, Spring Boot 3.3.6, Spring Security, JPA/Hibernate
- **Database:** MySQL
- **Security:** JWT (JSON Web Tokens) based authentication

## 🚀 Getting Started
*Note: Ensure you have your own secure environment variables configured. No default credentials are provided in this repository for security purposes.*

1. **Clone the repository.**
2. **Setup the Database:** Create a MySQL schema named `corporate_gifting`.
3. **Backend Setup:** Navigate to `backend/` and run `mvn spring-boot:run`.
4. **Frontend Setup:** Navigate to `frontend/`, run `npm install`, and then `npm run dev`.
