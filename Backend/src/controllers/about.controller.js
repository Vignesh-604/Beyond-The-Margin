import About from '../models/about.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const addOrUpdateTeamMember = async (req, res) => {
    try {
        const { type, name, role, bio, message, user, order } = req.body;

        if (!['founder', 'member'].includes(type)) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid type"));
        }

        if (!name || !role || !bio) {
            return res.status(400).json(new ApiResponse(400, null, "All fields are required"));
        }

        const localPath = req.file?.path;
        if (!localPath) {
            return res.status(400).json(new ApiResponse(400, null, "Image file missing"));
        }

        const uploadResult = await uploadOnCloudinary(localPath);
        if (!uploadResult) {
            return res.status(500).json(new ApiResponse(500, null, "Image upload failed"));
        }

        const existing = await About.findOne({ type, name });

        if (existing) {
            existing.name = name;
            existing.role = role;
            existing.bio = bio;
            existing.image = uploadResult.secure_url;
            existing.order = order
            if (type === "founder") existing.message = message || "";

            await existing.save();
            return res.status(200).json(new ApiResponse(200, existing, `${type} updated successfully`));
        } else {
            const newPerson = await About.create({
                type,
                name,
                role,
                bio,
                message: type === "founder" ? message : undefined,
                image: uploadResult.secure_url,
                user, order
            });

            return res.status(201).json(new ApiResponse(201, newPerson, `${type} added successfully`));
        }
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error, "Internal server error"));
    }
};


const addOrUpdateAboutSection = async (req, res) => {
    try {
        const { type, title, content, order } = req.body;

        if (!['hero', 'mission'].includes(type)) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid type. Only 'hero' or 'mission' allowed."));
        }

        if (!title || !content) {
            return res.status(400).json(new ApiResponse(400, null, "Title and content are required."));
        }

        // For type "hero" - update or create a single document
        if (type === 'hero') {
            const existing = await About.findOne({ type });

            if (existing) {
                existing.title = title;
                existing.content = content;
                if (order !== undefined) existing.order = order;

                await existing.save();
                return res.status(200).json(new ApiResponse(200, existing, "Hero section updated successfully"));
            }

            const newHero = await About.create({ type, title, content, order });
            return res.status(201).json(new ApiResponse(201, newHero, "Hero section created successfully"));
        }

        // For type "mission" - allow adding multiple entries
        const newMission = await About.create({ type, title, content, order });
        return res.status(201).json(new ApiResponse(201, newMission, "Mission section added successfully"));

    } catch (error) {
        console.error("Error in addOrUpdateAboutSection:", error);
        return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
    }
};

const getAbout = async (_req, res) => {
    const data = await About.find({}).select(" -createdAt -updatedAt -_id -__v ").sort({ order: 1 })

    let result = {
        hero: {},
        mission: [],
        founder: {},
        members: []
    }

    data.forEach((doc) => {
        if (["hero", "founder"].includes(doc.type)) result[doc.type] = doc
        else if (doc.type === 'mission') result.mission.push(doc);
        else if (doc.type === 'member') result.members.push(doc);
    })
    return res.status(201).json(new ApiResponse(201, result, "Got em"));
}

export { addOrUpdateTeamMember, addOrUpdateAboutSection, getAbout }