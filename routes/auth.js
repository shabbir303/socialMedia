import express from "express";

import {login} from "../contollers/auth.js";

const router = express.Router();
router.post("/login", login);
export default router;