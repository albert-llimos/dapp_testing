// Instead of this routes.js we should be able to use
// NextJs Dynamic routing (we do it this way because Udemy)

const routes = require ('next-routes')();

// We need to add a case for our static routings 
// because otherwise our dynamic routing breaks it
routes
  .add('/contracts/new', '/contracts/new')
  .add('/contracts/:address', '/contracts/show');

module.exports = routes;
