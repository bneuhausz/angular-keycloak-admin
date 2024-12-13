A basic Angular 19 + Angular Material 19 app to provide a limited interface to manage users in Keycloak within a realm.

!!! THIS IS ONLY FOR LEARNING PURPOSES !!!

!!!!! ABSOLUTELY DO NOT DO THIS IN PRODUCTION WITHOUT PROPERLY SETTING UP KC AND HAVING A SECURE API BETWEEN THE CLIENT AND KC !!!!!

Docker-compose file with Keycloak and Postgres for local development:

https://github.com/bneuhausz/docker-compose-files/tree/main/keycloak-admin

Settings are obviously not safe for production use.
Volumes are not included.
If you want to try the application, create a user-manager realm role and assign it the necessary claims to manage users and roles.
You'll also need to create myrealm and myclient.
