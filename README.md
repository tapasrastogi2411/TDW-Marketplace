# TDW Market

## Team Members

| Full Name         | Email                              | UTORid   | Stu. No.   | 
| ----------------- | ---------------------------------- | -------- | ---------- | 
| Divyam Patel      |                                    |          |            |       
| Tapas Rastogi     | tapas.rastogi@mail.utoronto.ca     | rastog32 | 1005734608 |
| Winson Yuan       |                                    |          |            |


## Project Description
This is a marketplace app which allows: 
- Users to login through various other providers 
- Users to list items for sale (with multiple videos/image uploads), specify more details about the item
- Users to search for items listed for sale and inquire the seller for more information
- Sellers to create live bidding sessions in a video call

## Concepts to be for the Challenge Factor
- `OAuth 2.0` - Users are able to sign in to our application using other oauth providers such as Google, Facebook and more that request authorization for multiple scopes such as contact information 
- `Real-time interaction` - Sellers would be able to host live bidding sessions with a video chat where they would have the option to also change their background
- `Workers` - Utilize workers in backend to send emails after a few minutes after registration

## Key features to be by the beta version
- Plan on getting `OAuth 2.0` to authenticate users to login to our application 
- Users can add new items to sell and view others items put for sale
- Live video bidding sessions
- Functional and working UI
- If time permits, deploy web application in a docker container

## Additional features to be by final version
- Enhance the UI with library components such as Material UI/Tailwind CSS
- Workers implemented to send emails after user registers and inquires about an item
- Live video session now have the ability to change their backgrounds

## Tech Stack to be used to build the application
- MongoDB - database
- Express - backend
- React and Material UI/Tailwind CSS - frontend 
- NodeJS
- API powered by GraphQL

## Method of Deployment
- Dockerize and push to GitHub container registry for both frontend and backend application
- Deploy with Google Kubernetes Engine cluster

