# Moip Integration Sample

Sample integration for Moip payment gateway using Node.js.

The application can be tested on [http://moip-integration-sample.herokuapp.com/](http://moip-integration-sample.herokuapp.com/).

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

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

After [creating an account on Heroku](https://signup.heroku.com/): 

```sh
$ heroku create
$ git push heroku master
$ heroku ps:scale web=1
$ heroku open
```

## License

Licensed under the [The MIT License (MIT)](http://opensource.org/licenses/MIT). Please see [LICENSE](LICENSE) for more information.