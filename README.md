# Moip Integration Sample - Node.js

Sample integration for [Moip payment gateway](https://moip.com.br/en/) using Node.js.

The application can be tested on [http://moip-integration-sample.herokuapp.com/](http://moip-integration-sample.herokuapp.com/).

For more information on Moip integration, please refer to [development docs](https://moip.com.br/para-devs/).

## Dependencies

- [Node.js](http://nodejs.org/)
- [Heroku Toolbelt](https://toolbelt.heroku.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Database

Create the database using the script [create.sql](db/create.sql). 

## Running locally

```sh
$ git clone https://github.com/intentor/moip-integration-sample.git
$ cd moip-integration-sample
$ npm install
$ npm start
```

The app should start on [localhost:8080](http://localhost:8080/).

## Deploying to Heroku

After [creating an account](https://signup.heroku.com/) on Heroku: 

```sh
$ heroku create
$ git push heroku master
$ heroku open
```

For more information on using Heroku with Node.js, please refer to [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs).

## License

Licensed under the [The MIT License (MIT)](http://opensource.org/licenses/MIT). Please see [LICENSE](LICENSE) for more information.