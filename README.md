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

        ```bash

    curl --location 'http://localhost:5000/v1.0.0/apis/v1.0.0/apis/users/register' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "userName": "MD Naimur Rahman",
    "email": "naimurtsc567@gmail.com",
    "contactNumber": "01632970990",
    "password": "123456",
    "role": "rider"
    }'

  - /users/verifyAccount

    - curl:

  - /users/login

    - curl:

  - /users/updateUser/:id

    - curl:

  - /users/updatePassword

    - curl:

  - /users/updateActiveStatus

    - curl:

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
