# Plan for Adding Organizational Categories

## Overview

This plan outlines the steps required to add the ability for organizations to add categories that are only visible to members of that organization. This will involve changes to the backend (server) to handle the organization-specific categories and the frontend (client) to display these categories.

## Detailed Steps

1.  **Explore the existing category implementation:**
    *   Use `read_file` to examine the existing category model (`server/models/category.js`) to understand the current schema.
    *   Use `read_file` to examine the existing category controller (`server/controllers/category.js`) to understand how categories are currently handled.
2.  **Modify the category model:**
    *   Add an `organizationId` field to the category model (`server/models/category.js`). This field will be a `mongoose.Schema.Types.ObjectId` that references the `Organization` model. It will be null for global categories and will contain the ID of the organization for organization-specific categories.
3.  **Modify the category controller:**
    *   Add a route for creating organization-specific categories (`POST /api/categories/organization`). This route will:
        *   Check if the user is an organization member.
        *   Create a new category with the `organizationId` set to the user's organization ID.
    *   Modify the existing `GET /api/categories` route to:
        *   Retrieve all global categories (categories with `organizationId` set to null).
        *   Retrieve all organization-specific categories for the user's organization.
        *   Return both global and organization-specific categories in the response.
    *   Add middleware to protect the organization-specific category routes. This middleware will:
        *   Check if the user is an organization member.
        *   Check if the user has the necessary permissions to create, modify, or delete organization-specific categories.
4.  **Update the API endpoints:**
    *   Add an endpoint for creating organization-specific categories (`POST /api/categories/organization`).
    *   Modify the existing endpoint for retrieving categories (`GET /api/categories`) to include organization-specific categories.
5.  **Update the frontend:**
    *   Modify the category management page to allow organizations to create categories. This will involve adding a form for creating organization-specific categories.
    *   Modify the category display logic to include organization-specific categories. This will involve filtering the categories based on the user's organization.
6.  **Testing:**
    *   Test the new functionality to ensure that it works as expected. This will involve:
        *   Creating organization-specific categories.
        *   Retrieving organization-specific categories.
        *   Modifying organization-specific categories.
        *   Deleting organization-specific categories.
7.  **Deployment:**
    *   Deploy the changes to the production environment.

## Mermaid Diagram

```mermaid
graph LR
    A[User Request: Add organizational categories] --> B(Explore existing category implementation);
    B --> C{Read server/models/category.js};
    C --> D{Read server/controllers/category.js};
    D --> E(Modify category model);
    E --> F{Add organizationId field to server/models/category.js};
    F --> G(Modify category controller);
    G --> H{Add route for creating organization-specific categories to server/controllers/category.js};
    H --> I{Modify GET route to include organization-specific categories in server/controllers/category.js};
    I --> J{Add middleware to protect organization-specific category routes in server/controllers/category.js};
    J --> K(Update API endpoints);
    K --> L{Add endpoint for creating organization-specific categories};
    L --> M{Modify existing endpoint for retrieving categories};
    M --> N(Update frontend);
    N --> O{Modify category management page to allow organizations to create categories};
    O --> P{Modify category display logic to include organization-specific categories};
    P --> Q(Testing);
    Q --> R{Test the new functionality};
    R --> S(Deployment);
    S --> T{Deploy the changes};