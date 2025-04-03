import express from "express";
export const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import { check, validationResult } from "express-validator";
// import auth from "../../middleware/auth.js";
import User from "../../models/user.js";
import Pet from "../../models/Pet.js";
import Application from "../../models/Application.js";
import Organization from "../../models/Organization.js";
import LostPetReport from "../../models/LostPetReport.js";

const auth = async (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// @route   GET api/auth
// @desc    Get user by token
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
);

// ---- Adopter Features ----

// @route   GET api/auth/pets/search
// @desc    Search for pets (species, breed, age, size, location)
// @access  Public
router.get("/pets/search", async (req, res) => {
  const { species, breed, age, size, location } = req.query;
  const query = {};

  if (species) query.species = species;
  if (breed) query.breed = breed;
  if (age) query.age = age;
  if (size) query.size = size;
  if (location) query.location = location; // Assuming location can be a city, zip code, etc.

  try {
    const pets = await Pet.find(query);
    res.json(pets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/auth/pets/:id
// @desc    View detailed pet profile
// @access  Public
router.get("/pets/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate("medicalHistory"); // Assuming medical history is a separate model/field
    if (!pet) {
      return res.status(404).json({ msg: "Pet not found" });
    }
    res.json(pet);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Pet not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth/applications
// @desc    Submit adoption application
// @access  Private (Requires authentication)
router.post("/applications", auth, async (req, res) => {
  const { petId, message } = req.body; // Assuming petId and a message are required

  try {
    const application = new Application({
      pet: petId,
      applicant: req.user.id,
      message,
      status: "pending", // Default status
    });

    await application.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ---- Foster Features ----

// @route   POST api/auth/foster-applications
// @desc    Apply to become a foster parent
// @access  Private (Requires authentication)
router.post("/foster-applications", auth, async (req, res) => {
  const { message } = req.body; // Specific application details for fostering

  try {
    //Create a foster application
    const fosterApplication = new Application({
      applicant: req.user.id,
      applicationType: "foster", // distinguish different types of apps
      message,
      status: "pending", // Default status
    });

    await fosterApplication.save();
    res.json(fosterApplication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/auth/foster/pets
// @desc    Get pets managed by the foster (assuming a relation exists in your models)
// @access  Private (Requires authentication and foster role/relationship check)
router.get("/foster/pets", auth, async (req, res) => {
  try {
    // Assuming you have a way to determine which pets this foster manages
    // This could involve checking the 'foster' field in the Pet model, or a separate
    // 'FosterPet' join table.  This is a placeholder; you'll need to implement the specific logic.
    const pets = await Pet.find({ foster: req.user.id }); //Example using a foster field in Pet model
    res.json(pets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth/foster/pet/:petId/update-status
// @desc    Update pet status (e.g., needs, medical updates, etc.) - specific to foster
// @access  Private (Requires authentication and foster role/relationship)
router.post("/foster/pet/:petId/update-status", auth, async (req, res) => {
  const { petId } = req.params;
  const { statusUpdates } = req.body; // Assuming updates will be in this format

  try {
    //Check if the pet exists
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ msg: "Pet not found" });
    }

    //Check if the logged-in user is the foster for this pet (add your authorization logic here)
    if (!pet.foster.equals(req.user.id)) {
      return res.status(401).json({ msg: "User not authorized" }); //Unauthorized
    }

    //Assuming statusUpdates is an object or array of updates
    if (statusUpdates) {
      //Implement your update logic here
      pet.statusUpdates = statusUpdates;
      await pet.save();
    }

    res.json(pet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ---- Rescues/Shelters Features ----

// @route   POST api/auth/organizations
// @desc    Create and manage organization profile
// @access  Private (Requires authentication, admin or shelter role?)
router.post("/organizations", auth, async (req, res) => {
  const { name, description, location } = req.body; // Organization profile details.

  try {
    const organization = new Organization({
      name,
      description,
      location,
      user: req.user.id, // Link the org to the creator (user)
    });

    await organization.save();
    res.json(organization);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/auth/organizations/:id
// @desc    Update organization profile
// @access  Private (Requires authentication, admin or shelter role AND ownership)
router.put("/organizations/:id", auth, async (req, res) => {
  const { name, description, location } = req.body; // Updated profile details

  try {
    let organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ msg: "Organization not found" });
    }

    // Ensure the user is the owner of the organization (or an admin)
    if (!organization.user.equals(req.user.id) && req.user.role !== "admin") {
      // Assuming a 'role' field exists
      return res.status(401).json({ msg: "Not authorized" });
    }

    organization.name = name;
    organization.description = description;
    organization.location = location;

    await organization.save();
    res.json(organization);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Organization not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth/pets
// @desc    Create pet listing (shelter/rescue)
// @access  Private (Requires authentication and shelter/rescue role)
router.post("/pets", auth, async (req, res) => {
  const {
    species,
    breed,
    age,
    size,
    name,
    description,
    images, // Array of image URLs or paths
    medicalHistory, // Assuming medical history is detailed
    shelterId, // or organizationId
    location,
  } = req.body;

  try {
    // Basic validation (improve this!)
    if (!species || !breed || !age) {
      return res
        .status(400)
        .json({ msg: "Please provide species, breed, and age" });
    }

    //Check if the user is authorized to create a pet listing for the shelter
    const organization = await Organization.findById(shelterId);
    if (!organization) {
      return res.status(404).json({ msg: "Organization not found" });
    }
    if (!organization.user.equals(req.user.id) && req.user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const newPet = new Pet({
      species,
      breed,
      age,
      size,
      name,
      description,
      images,
      medicalHistory,
      shelter: shelterId, // or organization
      location,
      // Add other pet details as needed (e.g., temperament, special needs)
    });

    const pet = await newPet.save();
    res.json(pet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/auth/organizations/:orgId/pets
// @desc    Get pets listed by a specific organization/shelter
// @access  Public
router.get("/organizations/:orgId/pets", async (req, res) => {
  try {
    const pets = await Pet.find({ shelter: req.params.orgId });
    res.json(pets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/auth/applications/organization/:orgId
// @desc    Get adoption and foster applications for an organization
// @access  Private (Requires authentication, shelter/rescue role, and ownership of the org)
router.get("/applications/organization/:orgId", auth, async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.orgId);
    if (!organization) {
      return res.status(404).json({ msg: "Organization not found" });
    }

    //Authorization. Make sure the logged in user is an admin or the owner of the organization.
    if (!organization.user.equals(req.user.id) && req.user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const applications = await Application.find({
      $or: [
        {
          pet: {
            $in: await Pet.find({ shelter: req.params.orgId }).distinct("_id"),
          },
        },
        { applicationType: "foster", applicant: req.user.id },
      ], // find applications for pets belonging to the org or foster applications
    })
      .populate("pet")
      .populate("applicant"); // populate user details

    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/auth/applications/:appId/status
// @desc    Update the status of an application
// @access  Private (Requires authentication and shelter/rescue role and permission to manage the org)
router.put("/applications/:appId/status", auth, async (req, res) => {
  const { appId } = req.params;
  const { status } = req.body;

  try {
    // Retrieve the application
    let application = await Application.findById(appId);
    if (!application) {
      return res.status(404).json({ msg: "Application not found" });
    }

    //Check if the user is authorized to update the application status
    // Check if the user is an admin, or owner of the organization associated with the pet
    if (application.pet) {
      // Adoption app
      const pet = await Pet.findById(application.pet);
      if (!pet) {
        return res.status(404).json({ msg: "Pet not found" });
      }

      const organization = await Organization.findById(pet.shelter);
      if (!organization) {
        return res.status(404).json({ msg: "Organization not found" });
      }

      if (!organization.user.equals(req.user.id) && req.user.role !== "admin") {
        return res.status(401).json({ msg: "Not authorized" });
      }
    } else if (application.applicationType === "foster") {
      // Foster applications (logic might be slightly different, as foster apps aren't tied to a pet)
      const organization = await Organization.findOne({ user: req.user.id }); // Check if the user is a shelter owner

      if (!organization && req.user.role !== "admin") {
        return res.status(401).json({ msg: "Not authorized" });
      }
    }

    //Update the application status
    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ---- Pet Owners Features ----

// @route   POST api/auth/lost-pets
// @desc    Report a lost pet
// @access  Private (Requires authentication)
router.post("/lost-pets", auth, async (req, res) => {
  const {
    species,
    breed,
    age,
    size,
    name,
    description,
    location,
    contactInfo, //How to contact the owner
    images, // Array of images or image paths
  } = req.body;

  try {
    const lostPetReport = new LostPetReport({
      species,
      breed,
      age,
      size,
      name,
      description,
      location,
      contactInfo,
      images,
      user: req.user.id, // Link to the reporting user
    });

    await lostPetReport.save();
    res.json(lostPetReport);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/auth/lost-pets
// @desc    Get all Lost pet reports (possibly filtered by location)
// @access  Public (Consider access restrictions, or a separate route for admins)
router.get("/lost-pets", async (req, res) => {
  const { location } = req.query; // Filter by location

  try {
    let query = {};
    if (location) {
      query.location = location; // Simple location filter
      // Consider more advanced location filtering (e.g. within a radius)
    }

    const lostPets = await LostPetReport.find(query);
    res.json(lostPets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/auth/lost-pets/:id
// @desc    Get a lost pet report by ID (Admin/Owner access control needed)
// @access  Private (Requires authentication and authorization checks)
router.get("/lost-pets/:id", auth, async (req, res) => {
  try {
    const lostPetReport = await LostPetReport.findById(req.params.id);

    if (!lostPetReport) {
      return res.status(404).json({ msg: "Report not found" });
    }

    //Authorization - Ensure the logged in user is the owner of the report or an admin
    if (!lostPetReport.user.equals(req.user.id) && req.user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" });
    }

    res.json(lostPetReport);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Report not found" });
    }
    res.status(500).send("Server Error");
  }
});

// ---- Admin Features ----

// @route   PUT api/auth/users/:id/verify
// @desc    Verify a rescue or shelter (Admin only)
// @access  Private (Requires authentication and admin role)
router.put("/users/:id/verify", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    //Authorization
    if (req.user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" });
    }

    user.isVerified = true; // Or a more specific field
    await user.save();
    res.json({ msg: "User verified" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   GET api/auth/users
// @desc    Get all users (Admin only)
// @access  Private (Requires authentication and admin role)
router.get("/users", auth, async (req, res) => {
  try {
    //Authorization
    if (req.user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/auth/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private (Requires authentication and admin role)
router.put("/users/:id/role", auth, async (req, res) => {
  const { role } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    //Authorization
    if (req.user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" });
    }

    //Validate the role (e.g. using an enum)
    if (!["adopter", "foster", "rescue", "admin", "pet_owner"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/auth/pets/:id
// @desc    Delete a pet listing (Admin only)
// @access  Private (Requires authentication and admin role)
router.delete("/pets/:id", auth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ msg: "Pet not found" });
    }

    //Authorization
    if (req.user.role !== "admin") {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await pet.remove();
    res.json({ msg: "Pet listing removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Pet not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   GET api/auth/platform-stats
// @desc    Get platform statistics (adoptions, user engagement) (Admin only)
// @access  Private (Requires authentication and admin role)
router.get("/platform-stats", auth, async (req, res) => {
  try {
    //Authorization
    if (req.user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" });
    }

    //Calculate Adoption Rates (example - needs more specific logic)
    const totalApplications = await Application.countDocuments({
      status: "approved",
    }); //Approved application count
    const totalPetsAdopted = await Pet.countDocuments({ isAdopted: true }); //Assume isAdopted field exists
    const adoptionRate =
      totalApplications > 0 ? (totalPetsAdopted / totalApplications) * 100 : 0;

    //User Engagement (example: count active users in a period)
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }); //Users logged in the last 7 days

    res.json({
      adoptionRate,
      activeUsers,
      // Add more statistics as needed (e.g., total users, shelter counts)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
