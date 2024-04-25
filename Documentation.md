## MakerRepoApp Documentation
### Components

#### Navbar
- **Props:** 
  `user`: An object representing the user details.
- **Description:** Renders the navigation bar with links to the Home, Profile, and Help pages. Displays different navigation options based on the user's role.

#### Rfid
- **Props:** 
  `spaceId`: An optional number representing the ID of the space for RFID scanning.
- **Description:** Handles the RFID card scanning process. Displays a button to start scanning and shows the status of the scan (error, warning, success) with corresponding messages.

#### SpaceHourCard
- **Props:** 
  `hour`: An object representing the hour details for a space.
- **Description:** Displays a card with space hours information, including name, email, address, phone number, and details for students, public, and summer hours.

#### TabPanel
- **Props:**
  - `children`: The content to be displayed in the tab panel.
  - `index`: The index of the tab panel.
  - `value`: The index of the currently selected tab.
- **Description:** Creates a tab panel with accessibility props. Displays the content only if the tab is currently selected.

### Screens

#### Help
- **Description:** This screen provides a form for users to send help requests via email. It displays the app version and offers a logout button.
- **Key Functions:**
  - `handleLogout`: Logs the user out and redirects to the login page.
  - `formValidation`: Validates the input fields of the form.
  - `sendSupportEmail`: Sends the support email with the user's input.

#### Home
- **Props:** 
  `user`: An object representing the user details.
- **Description:** This screen displays a personalized greeting to the user and renders either the SpaceDashboard or SpaceHours component based on the user's role.

#### Login
- **Props:** 
  `setUser`: A function to set the user details in the parent component.
- **Description:** This screen provides a form for user authentication. It allows users to input their username/email and password to log in.
- **Key Functions:**
  `handleLogin`: Authenticates the user and sets the user session.

#### Profile
- **Description:** This screen displays the user's profile information and allows admins to manage user roles and programs.
- **Key Functions:**
  - `getProfile`: Fetches and displays the user's profile information.
  - `handleRoleChange`: Updates the user's role.
  - `handleDevProgramChange`: Toggles the user's participation in the development program.
  - `handleVolunteerProgramChange`: Toggles the user's participation in the volunteer program.
  `onSubmit`: Submits the changes to the user's role or programs.

#### SpaceDashboard
- **Description:** This screen serves as the main dashboard for space management. It includes tabs for different functionalities such as viewing the dashboard, searching for users, managing training sessions, and shifts.
- **Key Components:**
  - `Dashboard`: Displays signed-in users and allows signing out.
  - `Search`: Allows searching and signing in users.
  - `NewTrainingSession`: Form for creating new training sessions.
  - `TrainingSessions`: Lists and manages training sessions.
  - `Shifts`: Displays the shifts schedule.

#### SpaceHours
- **Description:** This screen displays the opening hours for different spaces.
- **Key Functions:**
  `getHours`: Fetches and displays the opening hours for spaces.

### Utils

#### Common
- **Description:** This utility file contains functions for managing user sessions.
- **Key Functions:**
  - `getUser`: Retrieves the user details from local storage.
  - `getToken`: Retrieves the authentication token from local storage.
  - `removeUserSession`: Removes the user details and token from local storage.
  - `setUserSession`: Stores the user details and token in local storage.

#### Contexts
- **Description:** This utility file contains context for managing the logged-in state across the application.
- **Key Contexts:**
   `LoggedInContext`: A context for tracking and updating the logged-in state.

#### EnvVariables
- **Description:** This utility file contains environment variables for the application, such as the API URL and app version.
- **Key Variables:**
  - `api_url`: The base URL for API requests.
  - `app_release_type`: The release type of the application (e.g., Production).
  - `app_version`: The version of the application.

#### HTTPRequests
- **Description:** This utility file contains functions for making HTTP requests with error handling.
- **Key Functions:**
  - `get`: Makes a GET request to the specified route.
  - `patch`: Makes a PATCH request to the specified route.
  - `put`: Makes a PUT request to the specified route.
  - `post`: Makes a POST request to the specified route.
  - `notifyAndReturn`: Notifies an error to an error tracking service and returns the error.
