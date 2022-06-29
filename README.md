# TDW Market

## Team Members

| Full Name         | Email                              | UTORid   | Stu. No.   | 
| ----------------- | ---------------------------------- | -------- | ---------- | 
| Divyam Patel      | divyam.patel@mail.utoronto.ca      | pate1006 | 1006139698 |       
| Tapas Rastogi     | tapas.rastogi@mail.utoronto.ca     | rastog32 | 1005734608 |
| Winson Yuan       | winson.yuan@mail.utoronto.ca       | yuanwins | 1006414051 |


## Project Description
This is a marketplace app which allows: 
- Users to login through various other providers 
- Users to list items for sale (with multiple image uploads), specify more details about the item
- Sellers to create live bidding sessions in a video call

## Concepts to be used for Challenge Factor
- `OAuth 2.0` - Users are able to sign in to our application using other oauth providers such as Google, Facebook and more that request authorization for multiple scopes such as contact information 
- `Real-time interaction` - Sellers would be able to host live bidding sessions with a video chat where they would have the option to also change their background
- `Workers` - Utilize workers in backend to send emails a few minutes after registration, and before live bidding sessions start
- `Scalability` = Using the Google Kubernetes Engine Cluster for deployment will explicitly take into account scalability in our web application's design

## Key features to be completed by the beta version
- Plan on getting `OAuth 2.0` to authenticate users to login to our application 
- Live video bidding sessions
- Deploy web application in a docker container
- Functional and working UI
- Users can add new items to sell and view others items put for sale

## Additional features to be by final version
- Enhance the UI with library components such as Material UI/Tailwind CSS
- Workers implemented to send emails after user registers and inquires about an item, and before live bidding sessions start
- Live video session now have the ability to change their backgrounds

## Tech Stack to be used to build the application
- MongoDB - database
- Express - backend
- React and Material UI/Tailwind CSS - frontend 
- NodeJS
- API powered by GraphQL
- Images uploaded by users to be stored in Amazon S3

## Method of Deployment
- Dockerize and push to GitHub Container Registry for both frontend and backend application
- Deploy with Google Kubernetes Engine Cluster

