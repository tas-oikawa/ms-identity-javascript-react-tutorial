const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const httpContext = require('express-http-context');

const rateLimit = require('express-rate-limit');

const jwt = require("jsonwebtoken");


const authConfig = require('./authConfig.js');
const router = require('./routes/index');
const { validateIdToken } = require('./common/tokenValidator')


const app = express();

/**
 * If your app is behind a proxy, reverse proxy or a load balancer, consider
 * letting express know that you are behind that proxy. To do so, uncomment
 * the line below.
 */

// app.set('trust proxy',  /* numberOfProxies */);

/**
 * HTTP request handlers should not perform expensive operations such as accessing the file system,
 * executing an operating system command or interacting with a database without limiting the rate at
 * which requests are accepted. Otherwise, the application becomes vulnerable to denial-of-service attacks
 * where an attacker can cause the application to crash or become unresponsive by issuing a large number of
 * requests at the same time. For more information, visit: https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(cors());

app.use(httpContext.middleware);
app.use(express.json())
app.use(express.urlencoded({ extended: false}));
app.use(morgan('dev'));

app.use(
    '/api',
    async (req, res, next) => {
      const authHeader = req.get("Authorization");
      if (authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7, authHeader.length);
        await validateIdToken(token, (code) => {
          if (code === 200) {
            httpContext.set("idToken", token);
            const decoded = jwt.decode(token, { complete: true });
            httpContext.set("decodedToken", decoded);
            next();
          }
          next();
        });
      } else {
        //Error
      }
    },
    router, // the router with all the routes
    (err, req, res, next) => {
        /**
         * Add your custom error handling logic here. For more information, see:
         * http://expressjs.com/en/guide/error-handling.html
         */

        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // send error response
        res.status(err.status || 500).send(err);
    }
);

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log('Listening on port ' + port);
});

module.exports = app;
