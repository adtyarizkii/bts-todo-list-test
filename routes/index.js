const express = require("express");
const authRoute = require("./auth.route");
const healthRoute = require("./health.route");
const checklistRoute = require("./checklist.route");
const itemRoute = require("./item.route");

const router = express.Router();

const defaultRoutes = [
    {
        path: "/auth",
        route: authRoute,
    },
    {
        path: "/health",
        route: healthRoute,
    },
    {
        path: "/checklist",
        route: checklistRoute,
    },
    {
        path: "/item",
        route: itemRoute,
    },
]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
