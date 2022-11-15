import type { NextApiRequest, NextApiResponse } from 'next'
import { loginHandler } from "next-password-protect";

export default loginHandler("secret", {
  // Options go here (optional)
  cookieName: "next-password-protect",
});