import jwt from "jsonwebtoken";
import Organization from "../models/organization.js"; // Assuming the model path

const organizationAuth = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, import.meta.env.VITE_JWT_SECRET); // Use process.env for JWT secret
    req.organization = decoded.organization; // Assuming the payload structure is { organization: { id: organization.id } }
    console.log(decoded)
    // Optional: Verify the organization exists in the database
    const organization = await Organization.findById(req.organization.id);
    if (!organization) {
      return res.status(401).json({ msg: "Organization not found, authorization denied" });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default organizationAuth;