# Implementation Plan

## Overview
The overall goal is to streamline the client-side application by removing all features except for landing, contact, about, home, login, signup/register, forgot/reset password, all profile/authentication-related pages for general users, organizations, and administrators, and the "learn more" pages. This implementation aims to reduce the codebase size, simplify maintenance, and focus the application on its core functionalities as specified.

The scope of this task is limited to the `client` directory. It involves identifying and removing unnecessary React components, routes, and associated assets, as well as cleaning up configuration files and dependencies. The retained features should continue to function as intended.

## Types
No significant type system changes are anticipated as a direct result of removing components. Any types implicitly defined or used within the removed components will no longer be relevant.

## Files
File modifications will involve deleting entire directories and files related to removed features, and modifying core application files to reflect these removals.

### Files to be deleted:
*   `client/src/components/pages/AddComplaint.jsx`
*   `client/src/components/pages/AddReview.jsx`
*   `client/src/components/pages/ApprovedSwapRequests.jsx`
*   `client/src/components/pages/EditSwapRequest.jsx`
*   `client/src/components/pages/ExchangeSkills.jsx`
*   `client/src/components/pages/Marketplace.jsx`
*   `client/src/components/pages/MemberWorkshops.jsx`
*   `client/src/components/pages/ReceivedSwapRequests.jsx`
*   `client/src/components/pages/SentSwapRequests.jsx`
*   `client/src/components/pages/SkillSwapperChat.jsx`
*   `client/src/components/pages/SwapRequestDetails.jsx`
*   `client/src/components/pages/SwapRequestDetailsPage.jsx`
*   `client/src/components/pages/SwapRequestForm.jsx`
*   `client/src/components/pages/SwapRequests.jsx`
*   `client/src/components/pages/admin/CategoryManagement.jsx`
*   `client/src/components/pages/admin/complaints.jsx`
*   `client/src/components/pages/admin/ContactSubmissions.jsx`
*   `client/src/components/pages/admin/dashboard.jsx`
*   `client/src/components/pages/admin/MentorRequests.jsx`
*   `client/src/components/pages/admin/OrganizationRequests.jsx`
*   `client/src/components/pages/admin/OrganizationReviews.jsx`
*   `client/src/components/pages/admin/OrganizationSwaps.jsx`
*   `client/src/components/pages/organization/CategoryManagement.jsx`
*   `client/src/components/pages/organization/Complaints.jsx`
*   `client/src/components/pages/organization/ViewAllSwaps.jsx`
*   `client/src/components/pages/organization/ViewReviews.jsx`
*   `client/src/components/pages/organization/add-member.jsx`
*   `client/src/components/pages/organization/dashboard.jsx`
*   `client/src/components/pages/organization/Workshops.jsx`
*   `client/src/components/Notifications.jsx`
*   `client/src/components/Timeline.jsx`
*   `client/src/components/UpdateSwapRequestDialog.jsx`
*   All assets related to the above deleted pages (e.g., images in `client/src/components/pages/admin/`, `client/src/components/pages/organization/` if they are not used by retained pages).
*   Unused UI components from `client/src/components/ui/` that are not utilized by any of the retained pages. This will require a detailed analysis during implementation.

### Existing files to be modified:
*   `client/src/App.jsx`: Remove imports and `Route` components for all deleted pages.
*   `client/src/main.jsx`: Remove any imports related to removed components or features.
*   `client/package.json`: Remove unused dependencies.
*   `client/package-lock.json`: Update after `package.json` changes.
*   `client/components.json`: Remove aliases or configurations related to deleted components.
*   `client/vite.config.js`: Review for any configurations tied to removed features.
*   `client/jsconfig.json`: Review for any path aliases tied to removed features.
*   `client/index.html`: Review for any direct links or scripts related to removed features.
*   `client/src/index.css`: Review for any unused CSS rules or imports.

## Functions
Functions will be removed as part of the component deletions. Specifically, any functions defined within the `.jsx` files that are slated for deletion will be removed. No specific function modifications are planned for retained components unless they directly interact with removed features.

## Classes
React components in this codebase are primarily functional components. Therefore, "classes" in this context refer to these functional components. Any functional components within the `.jsx` files listed for deletion will be removed.

## Dependencies
Dependencies in `client/package.json` will be reviewed. Any dependencies that are solely used by the removed features will be uninstalled. This will involve:
*   Identifying unused `@radix-ui/react-*` packages.
*   Identifying other packages like `recharts`, `cmdk`, `date-fns`, `react-day-picker`, `sonner`, `zod`, `@hookform/resolvers`, `@tanstack/react-table` if they are only used by removed features.

## Testing
The testing approach will involve:
*   Verifying that the application successfully builds after all removals.
*   Launching the application locally and manually navigating through all retained pages (landing, contact, about, home, login, signup/register, forgot/reset password, profile, learn more, and all organization/admin auth/profile pages) to ensure they render correctly and their core functionalities (e.g., form submissions, navigation) work as intended.
*   Checking the browser console for any errors or warnings.

## Implementation Order
The implementation will follow these logical steps to minimize conflicts and ensure successful integration:

1.  **Remove unused page components and their associated assets:** Delete all `.jsx` files and their corresponding image/SVG assets from `client/src/components/pages/` that are not part of the retained features.
2.  **Update `client/src/App.jsx`:** Remove all imports and `Route` definitions corresponding to the deleted pages.
3.  **Remove unused general components:** Delete `client/src/components/Notifications.jsx`, `client/src/components/Timeline.jsx`, `client/src/components/UpdateSwapRequestDialog.jsx`.
4.  **Clean up `client/src/components/ui/`:** Analyze the remaining components and remove any UI components that are no longer used by the retained pages.
5.  **Clean up `client/package.json` and `client/package-lock.json`:** Remove unused dependencies and then run `npm install` to update `package-lock.json`.
6.  **Clean up `client/components.json`, `client/vite.config.js`, `client/jsconfig.json`, `client/index.html`, `client/src/index.css`:** Remove any references or configurations related to the deleted features.
7.  **Verify application functionality:** Perform a full manual test of all retained features to ensure they work as expected.
