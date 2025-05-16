# Plan for Approved Swap Requests Endpoints and Integration

This plan outlines the necessary backend endpoints and frontend modifications to replace the hardcoded data in `client/src/components/pages/ApprovedSwapRequests.jsx` with data fetched from the backend and implement the 'Update' and 'Track Request' functionalities.

## Refined Plan:

1.  **Backend Development (`server/controllers/swap_request.js`):**
    *   **Endpoint 1: Fetch Approved Swap Requests:** Create a new GET endpoint, e.g., `/api/swap-requests/approved`, to retrieve all approved swap requests for the current user.
        *   **Request:** No specific request body needed. Authentication token in headers.
        *   **Response:** A JSON array of approved swap request objects. Each object should include details needed for the table (id, profilePic, name, category, skills, deadline, status) and potentially the interaction ID for updates/tracking.
    *   **Endpoint 2: Add Status Update:** Create a POST endpoint, e.g., `/api/swap-requests/:id/update`, to add a status update for a specific swap request.
        *   **Request:**
            ```json
            {
              "updateContent": "string"
            }
            ```
            (where `:id` in the URL is the swap request ID)
        *   **Response:** A success message or the newly created update object.
    *   **Endpoint 3: Mark as Completed:** Create a PUT or POST endpoint, e.g., `/api/swap-requests/:id/complete`, to mark a specific swap request as completed.
        *   **Request:** No specific request body needed. Authentication token in headers.
        *   **Response:** A success message or the updated swap request object.
    *   **Endpoint 4: Fetch Swap Request Details and Updates:** The `GET /api/swap-requests/:id` endpoint already exists. Modify its controller function in `server/controllers/swap_request.js` to also fetch and include the associated status updates for the given swap request ID.
        *   **Request:** No specific request body needed. Authentication token in headers.
        *   **Response:** A JSON object containing the swap request details and an array of status update objects.

2.  **Frontend Integration (`client/src/components/pages/ApprovedSwapRequests.jsx`):**
    *   Replace the hardcoded `swapRequests` data with a state variable.
    *   Implement a `useEffect` hook to fetch approved swap requests from the new backend endpoint (`GET /api/swap-requests/approved`) when the component mounts.
    *   Update the table data source to use the fetched data.
    *   Modify the 'Update' column's cell renderer:
        *   Implement a dialog component for adding status updates and marking as completed.
        *   Add an event handler to the 'Update' button to open the dialog.
        *   Inside the dialog, implement forms and logic to call Endpoint 2 (`POST /api/swap-requests/:id/update`) and Endpoint 3 (`PUT /api/swap-requests/:id/complete`).
    *   Modify the 'Track Request' column's cell renderer:
        *   Add an event handler to the 'Track' element to navigate to a new page (e.g., `/swap-requests/:id`) for the specific swap request, using the existing `GET /api/swap-requests/:id` endpoint on that page.

3.  **Frontend Development (Swap Request Details Page - e.g., `client/src/components/pages/SwapRequestDetailsPage.jsx`):**
    *   Create a new component/page to display the details of a single swap request and its updates.
    *   This page should extract the swap request ID from the URL parameters.
    *   Implement a `useEffect` hook to fetch the specific swap request details and updates using the modified `GET /api/swap-requests/:id` endpoint.
    *   Render the swap request details and the list of updates on this page.

## Diagram:

```mermaid
graph TD
    A[ApprovedSwapRequests.jsx] --> B(Fetch Approved Requests)
    B --> C(GET /api/swap-requests/approved)
    C --> D[Backend: server/controllers/swap_request.js]
    D --> E(Query swap_request & swap_request_interaction)
    E --> F[Database]
    F --> D
    D --> C
    C --> B
    B --> A

    A --> G(Update Button Click)
    G --> H[Open Update Dialog]
    H --> I(Add Status Update)
    I --> J(POST /api/swap-requests/:id/update)
    J --> D
    D --> F
    F --> D
    D --> J
    J --> I
    I --> H

    H --> K(Mark as Completed)
    K --> L(PUT /api/swap-requests/:id/complete)
    L --> D
    D --> F
    F --> D
    D --> L
    L --> K
    K --> H

    A --> M(Track Request Click)
    M --> N[Navigate to Swap Request Details Page]
    N --> O[SwapRequestDetailsPage.jsx]
    O --> P(Fetch Swap Request Details & Updates)
    P --> Q(GET /api/swap-requests/:id)
    Q --> D
    D --> F
    F --> D
    D --> Q
    Q --> P
    P --> O