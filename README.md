# Moip Integration Sample

Sample integration for Moip payment gateway.

## Dependencies

- [Node.js](http://nodejs.org/)
- [Heroku Toolbelt](https://toolbelt.heroku.com/)

## Running Locally

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