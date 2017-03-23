# Moip Integration Sample - Node.js

Sample integration for [Moip payment gateway](https://moip.com.br/en/) using Node.js and Moip APIs v2.

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

## Testing

_Please keep in mind this is a sample, so validation and full error handling is not available._

Follow the steps on the page to test the app. When entering data, try to follow on screen formats and messages, so the app will work properly.

## Deploying to Heroku

After [creating an account](https://signup.heroku.com/) on Heroku: 

```sh
$ heroku create
$ git push heroku master
$ heroku open
```

For more information on using Heroku with Node.js, please refer to [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs).

## License

This sample uses [New Year Resolutions!](https://www.iconfinder.com/iconsets/new-year-resolutions) icon set by [Laura Reen](http://laurareen.com/) under [Creative Commons (Attribution 3.0 Unported](https://creativecommons.org/licenses/by/3.0/).

Licensed under the [The MIT License (MIT)](http://opensource.org/licenses/MIT). Please see [LICENSE](LICENSE) for more information.