import { passwordCheckHandler } from "next-password-protect";

export default passwordCheckHandler("secret", {
  // Options go here (optional)
  cookieName: "next-password-protect",
});
