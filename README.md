# TDW Market

## Deployed Site 
https://tdwmarket.me/

## Video Presentation Link

https://youtu.be/Pmf4oRrXbqg

## Team Members

| Full Name         | Email                              | UTORid   | Stu. No.   | 
| ----------------- | ---------------------------------- | -------- | ---------- | 
| Divyam Patel      | divyam.patel@mail.utoronto.ca      | pate1006 | 1006139698 |       
| Tapas Rastogi     | tapas.rastogi@mail.utoronto.ca     | rastog32 | 1005734608 |
| Winson Yuan       | winson.yuan@mail.utoronto.ca       | yuanwins | 1006414051 |


## Project Description
This is a marketplace app which allows: 
- Users to login through google provider
- Users to list items for sale, specify more details about the item
- Sellers to create live bidding sessions in a video call

## Concepts to be used for Challenge Factor
- `OAuth 2.0` - Users are able to sign in to our application using other oauth providers such as Google and authorization for multiple scopes such as access to their google calendar 
- `Real-time interaction` - Sellers would be able to host live bidding sessions with a video chat where they can disconnect all the other users in the video call 
- `Workers` - Utilize workers in backend to send emails three minutes after signing up, and for setting the event in their google calendar 

## Key features to be completed by the beta version
- Plan on getting `OAuth 2.0` to authenticate users to login to our application 
- Live video bidding sessions
- Functional and working UI
- Users can add new items to sell and view others items put for sale

## Additional features to be completed by final version
- Enhance the UI with library components such as Tailwind CSS
- Workers implemented to send emails after user registers, and when adding event to calendar
- Live video sessions can allow users to be disconnected
- Deploy web application in a digital ocean vm

## Tech Stack to be used to build the application
- MongoDB, Redis - database
- Express - backend
- React and Tailwind CSS - frontend 
- NodeJS
- Images uploaded by users to be stored in Firebase Storage
### Packages 
- Socket.io and Simple Peer 
- Firebase 
- SendGrid 
- BullMQ 
- Mongoose 
- Google API 
- Redis Adapter 

## Method of Deployment
- Dockerize and push to Docker Hub for both frontend and backend application
- Deploy with Digital Ocean VM


