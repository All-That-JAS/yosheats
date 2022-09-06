# Yosheats
A fun and interactive web application created to motivate users to log their foods and receive food recommendations. Nintendo characters provide moral support and feedback based on user progress. 

Upon signup, each user inputs demographic information and nutritional goals are calculated based on user input. User authentication is validated through Firebase, with a Google sign-in option. Daily nutritional goals and food entries (data fetched from Calorie Ninja API) are both stored in the Firestore Database. Previous food logs are accessed using Firestore and are displayed with React Calendar library for a more interactive user experience. Having a service worker allows our app to have certain features of a progressive web application such as offline use capability through caching. After learning React class components and lifecycles in the program, we decided to build this app with React functional components and hooks.

Made with Node.js, HTML5, CSS, React, React Bootstrap, Firebase, Firestore Database, Calorie Ninja API, React-Calendar, and Party.js.

## Deployment
Deployed on Netlify. Check out Yosheats on [Netlify](https://yosheats.netlify.app/)!
