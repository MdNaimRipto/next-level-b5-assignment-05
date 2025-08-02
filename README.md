# Project Name:

- Ride management system

# Github:

- https://github.com/MdNaimRipto/next-level-b5-assignment-05

# Live link:

- https://assignment-05-backend-hazel.vercel.app

# Project pattern:

- MVC Pattern

# Technologies:

- Node.js

- Express

- Mongoose

- Cors

- Dotenv

- Bcrypt

- Zod

- Express-session

- http-status

- Jsonwebtoken

- Nodemailer

- ts-node-dev

# Folder Structure:

- src

  1. app.ts: Main file which is handling all the basic functionalities and middlewares

  2. server.ts: A file for handling the server codes

  3. App folder:

  - modules: Handling all the business logics, interfaces and schema for apis and routs in mvc like format.

  - routers: Managing all the routs and exposing them under one common/base route

  4. config: Handling dotenv and all .env configs

  5. errors: Handling all error logics for example Path Not Found Error, Validation error etc

  6. middlewares: Handling all the common/global middlewares.

  7. utils: Handling all the common utility functions around the application

  8. dist: Stored all TypeScript to JavaScript compiled codes.

# Project Features

1. Can Register, Verify Account using Mail and Login.

2. Can Update Profile details and Password

3. Riders can request rides to any specific driver

4. Riders can cancel the ride before the ride started

5. Drivers can accept or reject any ride and can update accepted rides status

6. Drivers can check there own earning

7. Both Driver and Rider can see there rides

8. Admin have access to see the rides and users

9. Admin can block or unblock any user and also can approve or cancel approval of any account

# How to run:

1. Clone the project from: https://github.com/MdNaimRipto/next-level-b5-assignment-05

2. Run: npm i / npm install

3. Add a .env file at root and add the values mentioned to the .env.example

4. Run: npm run dev / npm start to start the project.

5. Open Postman or any api testing applications to test the apis.

# Admin Credentials:

- email: admin00@gmail.com

- password: admin00

# End points & sample payload:

- User:

  - /users/register

    - curl:

    ```
    curl --location 'https://assignment-05-backend-hazel.vercel.app/v1.0.0/apis/users/register' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "userName": "MD Naimur Rahman",
    "email": "naimurtsc567@gmail.com",
    "contactNumber": "01632970990",
    "password": "123456",
    "role": "rider"
    }'

    ```

  - /users/verifyAccount

    - curl:

    ```
    curl --location --request PATCH 'https://assignment-05-backend-hazel.vercel.app/v1.0.0/apis/users/verifyAccount' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "email": "naimurtsc567@gmail.com",
    "contactNumber": "01632970990"
    }'

    ```

  - /users/login

    - curl:

    ```
    curl --location 'https://assignment-05-backend-hazel.vercel.app/v1.0.0/apis/users/login' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "email": "naimurtsc567@gmail.com",
    "password": "User@1357"
    }'

    ```

  - /users/updateUser/:id

    - curl:

    ```
    curl --location --request PATCH 'https://assignment-05-backend-hazel.vercel.app/v1.0.0/apis/users/updateUser/6888db743647c4576481bc52' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5haW11cnRzYzU2N0BnbWFpbC5jb20iLCJpZCI6IjY4ODhkYjc0MzY0N2M0NTc2NDgxYmM1MiIsInJvbGUiOiJyaWRlciIsImlhdCI6MTc1MzgwMDE5OCwiZXhwIjoxNzUzODg2NTk4fQ.ECNEZJkgkc7HPmrzcliFVHGvQ1H7AgmbyUH5UkmuXuA' \
    --header 'Content-Type: application/json' \
    --data '{
    "userName": "MD Naimur Rahman"
    }'

    ```

  - /users/updatePassword

    - curl:

    ```
    curl --location --request PATCH 'https://assignment-05-backend-hazel.vercel.app/v1.0.0/apis/users/updatePassword' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5haW11cnRzYzU2N0BnbWFpbC5jb20iLCJpZCI6IjY4ODhkYjc0MzY0N2M0NTc2NDgxYmM1MiIsInJvbGUiOiJyaWRlciIsImlhdCI6MTc1MzgwMDE5OCwiZXhwIjoxNzUzODg2NTk4fQ.ECNEZJkgkc7HPmrzcliFVHGvQ1H7AgmbyUH5UkmuXuA' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "userId": "6888db743647c4576481bc52",
    "currentPassword": "123456",
    "newPassword": "User@1357",
    "confirmPassword": "User@1357"
    }'

    ```

  - /users/updateActiveStatus

    - curl:

    ```
    curl --location --request PATCH 'https://assignment-05-backend-hazel.vercel.app/v1.0.0/apis/users/updateActiveStatus' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5haW11cnRzYzU2N0BnbWFpbC5jb20iLCJpZCI6IjY4ODhkYjc0MzY0N2M0NTc2NDgxYmM1MiIsInJvbGUiOiJyaWRlciIsImlhdCI6MTc1NDA1MTYwMywiZXhwIjoxNzU0MTM4MDAzfQ.eGF7qWt3dVqBmp7VB3E7aksWgriSiReJnAocvxC8JOU' \
    --header 'Content-Type: application/json' \
    --data '{
    "status": "active"
    }'
    ```

- Rides:

  - /rides/activeRides

    - curl:

    ```
    curl --location --request GET 'https://assignment-05-backend-hazel.vercel.app/v1.0.0/apis/rides/activeRides'

    ```

  - /rides/requestRide

    - curl:

    ```
    curl --location 'https://assignment-05-backend-hazel.vercel.app/v1.0.0/apis/rides/requestRide' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5haW11cnRzYzU2N0BnbWFpbC5jb20iLCJpZCI6IjY4ODhkYjc0MzY0N2M0NTc2NDgxYmM1MiIsInJvbGUiOiJyaWRlciIsImlhdCI6MTc1NDA1MTYwMywiZXhwIjoxNzU0MTM4MDAzfQ.eGF7qWt3dVqBmp7VB3E7aksWgriSiReJnAocvxC8JOU' \
    --header 'Content-Type: application/json' \
    --data '{
    "riderId": "6888db743647c4576481bc52",
    "driverId": "688cbf5582055c414206b4a2",
    "location": {
        "from": "Mirpur, Dhaka",
        "to": "Savar, Dhaka"
    },
    "fair": 300
    }'
    ```

  - /rides/updateRide

  - Can Update:

    - acceptStatus: "accepted" | "rejected"
    - rideStatusEnums: "inTransit" | "completed" | "cancelled";

    - curl:

    ```
    curl --location --request PATCH 'https://assignment-05-backend-hazel.vercel.app/v1.0.0/apis/rides/updateRide/688cc0f324eddfc304f9ba2a' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1kbmFpbXVycmFobWFuNjgxQGdtYWlsLmNvbSIsImlkIjoiNjg4Y2JmNTU4MjA1NWM0MTQyMDZiNGEyIiwicm9sZSI6ImRyaXZlciIsImlhdCI6MTc1NDA1NTM2OSwiZXhwIjoxNzU0MTQxNzY5fQ.8WYRN9CN3qNVSno4Z-a1vSWiCToW1H8IGs9laUUvWhw' \
    --header 'Content-Type: application/json' \
    --data '{
    "acceptStatus": "accepted"
    }'

    ```

  - /rides/viewMyRides

    - curl:

    ```
    curl --location --request GET 'https://assignment-05-backend-hazel.vercel.app/v1.0.0/apis/rides/viewMyRides' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1kbmFpbXVycmFobWFuNjgxQGdtYWlsLmNvbSIsImlkIjoiNjg4Y2JmNTU4MjA1NWM0MTQyMDZiNGEyIiwicm9sZSI6ImRyaXZlciIsImlhdCI6MTc1NDA1NTM2OSwiZXhwIjoxNzU0MTQxNzY5fQ.8WYRN9CN3qNVSno4Z-a1vSWiCToW1H8IGs9laUUvWhw'

    ```

  - /rides/viewEarningHistory

    - curl:

  ```
  curl --location --request GET 'https://assignment-05-backend-hazel.vercel.app/v1.0.0/apis/rides/viewEarningHistory/688cbf5582055c414206b4a2' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1kbmFpbXVycmFobWFuNjgxQGdtYWlsLmNvbSIsImlkIjoiNjg4Y2JmNTU4MjA1NWM0MTQyMDZiNGEyIiwicm9sZSI6ImRyaXZlciIsImlhdCI6MTc1NDA1NTM2OSwiZXhwIjoxNzU0MTQxNzY5fQ.8WYRN9CN3qNVSno4Z-a1vSWiCToW1H8IGs9laUUvWhw'
  ```

- Admin:

  - /admin/getAllUsers

    - curl:

    role(optional): rider | driver

    ```
    curl --location 'https://assignment-05-backend-hazel.vercel.app/v1.0.0/apis/admin/getAllUsers?role=driver' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluMDBAZ21haWwuY29tIiwiaWQiOiI2ODhjYzcyMDQ5MTI4NmJjODBlMWVhZDQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTQwNTY3MDAsImV4cCI6MTc1NDE0MzEwMH0.MSRcOkwB9yMA-PmhrNuFW1TchiWVZH_5AyuijJJJWt0 '

    ```

  - /admin/getAllRides

    - curl:

    ```
    curl --location 'https://assignment-05-backend-hazel.vercel.app/v1.0.0/apis/admin/getAllRides' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluMDBAZ21haWwuY29tIiwiaWQiOiI2ODhjYzcyMDQ5MTI4NmJjODBlMWVhZDQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTQwNTY3MDAsImV4cCI6MTc1NDE0MzEwMH0.MSRcOkwB9yMA-PmhrNuFW1TchiWVZH_5AyuijJJJWt0 '

    ```

  - /admin/updateApproveStatus

    - curl:

    ```
    curl --location --request PATCH 'https://assignment-05-backend-hazel.vercel.app/v1.0.0/apis/admin/updateApproveStatus/688cbf5582055c414206b4a2' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluMDBAZ21haWwuY29tIiwiaWQiOiI2ODhjYzcyMDQ5MTI4NmJjODBlMWVhZDQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTQwNTY3MDAsImV4cCI6MTc1NDE0MzEwMH0.MSRcOkwB9yMA-PmhrNuFW1TchiWVZH_5AyuijJJJWt0'

    ```

  - /admin/updateBlockStatus

    - curl:

    ```
    curl --location --request PATCH 'https://assignment-05-backend-hazel.vercel.app/v1.0.0/apis/admin/updateBlockStatus/688cbf5582055c414206b4a2' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluMDBAZ21haWwuY29tIiwiaWQiOiI2ODhjYzcyMDQ5MTI4NmJjODBlMWVhZDQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTQwNTY3MDAsImV4cCI6MTc1NDE0MzEwMH0.MSRcOkwB9yMA-PmhrNuFW1TchiWVZH_5AyuijJJJWt0'
    ```
