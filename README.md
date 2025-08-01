# Project Name:

- Ride management system

# Github:

- https://github.com/MdNaimRipto/next-level-b5-assignment-05

# Live link: N/A

# Project

- pattern: MVC Pattern

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

# End points & sample payload:

- User:

  - /users/register

    - curl:

    ```
    curl --location 'http://localhost:5000/v1.0.0/apis/v1.0.0/apis/users/register' \
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
    curl --location --request PATCH 'http://localhost:5000/v1.0.0/apis/users/verifyAccount' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "email": "naimurtsc567@gmail.com",
    "contactNumber": "01632970990"
    }'

    ```

  - /users/login

    - curl:

    ```
    curl --location 'http://localhost:5000/v1.0.0/apis/users/login' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "email": "naimurtsc567@gmail.com",
    "password": "User@1357"
    }'

    ```

  - /users/updateUser/:id

    - curl:

    ```
    curl --location --request PATCH 'http://localhost:5000/v1.0.0/apis/users/updateUser/6888db743647c4576481bc52' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5haW11cnRzYzU2N0BnbWFpbC5jb20iLCJpZCI6IjY4ODhkYjc0MzY0N2M0NTc2NDgxYmM1MiIsInJvbGUiOiJyaWRlciIsImlhdCI6MTc1MzgwMDE5OCwiZXhwIjoxNzUzODg2NTk4fQ.ECNEZJkgkc7HPmrzcliFVHGvQ1H7AgmbyUH5UkmuXuA' \
    --header 'Content-Type: application/json' \
    --data '{
    "userName": "MD Naimur Rahman"
    }'

    ```

  - /users/updatePassword

    - curl:

    ```
    curl --location --request PATCH 'http://localhost:5000/v1.0.0/apis/users/updatePassword' \
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
    curl --location --request PATCH 'http://localhost:5000/v1.0.0/apis/users/updateActiveStatus' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5haW11cnRzYzU2N0BnbWFpbC5jb20iLCJpZCI6IjY4ODhkYjc0MzY0N2M0NTc2NDgxYmM1MiIsInJvbGUiOiJyaWRlciIsImlhdCI6MTc1NDA1MTYwMywiZXhwIjoxNzU0MTM4MDAzfQ.eGF7qWt3dVqBmp7VB3E7aksWgriSiReJnAocvxC8JOU' \
    --header 'Content-Type: application/json' \
    --data '{
    "status": "active"
    }'
    ```

- Rides:

  - /rides/activeRides

    - curl:

  - /rides/requestRide

    - curl:

  - /rides/updateRide

    - curl:

  - /rides/viewMyRides

    - curl:

  - /rides/viewEarningHistory

    - curl:

- Admin:

  - /admin/getAllUsers

    - curl:

  - /admin/getAllRides

    - curl:

  - /admin/updateApproveStatus

    - curl:

  - /admin/updateBlockStatus

    - curl:

```

```
