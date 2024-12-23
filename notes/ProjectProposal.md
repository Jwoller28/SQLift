# Trackr

### Project Description

The application will allow users to track nutrition, exercise, and sleep with a calendar-based UI focused on user-set goals. Additionally, the application will allow users to share goals through posts and view summaries of their progress with in-built analytics. The application will use CalorieNinja (https://calorieninjas.com/) to make inputting daily nutrition easier through natural language prompts. 

### MVP Features 
- Users can register their accounts with username, password, email, picture, and goals for their overall healthPro
- Users can login using their username and password using JWT authentication
- Users can log sleep, exercise, and nutrition on a daily basis
- Users can input their meals and view the nutrition breakdown via the CalorieNinja APi
- Users can set sub-goals and main goals, and see goal progress on the calendar
- Users can make posts using data from their goal progress or text or photo input to be shared on a “close to” live feed
- Users can view posts streaming from all accounts
- Users can see an analytics tab to see how they have progressed since creating the account.
- Users can see a daily, weekly, or monthly report based on user preferences in their inbox

## Optional Features

### Group-Based Calendars
- Members can make or join multiple groups with users and view a shared group calendar that can impact their personal calendar. They can also filter their feed to only show posts from their group.
### Daily or Weekly Notifications
- Members will be notified based on their settings about their progress towards their goals. The goal notifications can be long-term or short-term.
### Workout Finder
- Members can leverage YouTube API to find workout videos and connect them to the workouts they set.
### Trainer/Coach Implementation
- Members can sign in as trainers with members assigned as their trainees where the trainee can have goals set and viewed by the trainer.
### Post Options
- Posts can be tagged and thus filtered for different options such as the media inside of them.
### Forget Password
- Every account should have a forget password option with a custom, temporary URL to recover an account based on an account’s email.
### Nearby Gym Feature
- Members can see a visual display of their local area, and see local gyms.

## User Stories (MVP)
- As a user, I should be able to register or log in to my account.
- As a user, I should be able to log sleep hours, water,  exercise, and nutrition information.
- As a user, I can set goals and see goal progress on a calendar.
- As a user, I should be able to make posts.
- As a user, I should be able to view a Real-time updating feed.
- As a user, I can see an analytics tab to see my progress.
- As a user, I can see an updated cumulative analysis of my goal progress

## Possible APIs
- https://calorieninjas.com/
- https://developers.google.com/youtube/v3/getting-started\

