import projectModel from '../models/project.model.js';
import * as projectService from '../services/project.service.js';
import * as userService from '../services/user.service.js';
import userModel from '../models/user.model.js';
import { validationResult } from 'express-validator';


export const createProject = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { name } = req.body;
        const loggedInUser = await userService.getOrCreateUser(req.user);
        if (!loggedInUser) {
            return res.status(401).json({ error: 'User session not found. Please log in again.' });
        }
        const userId = loggedInUser._id;

        const newProject = await projectService.createProject({ name, userId });

        res.status(201).json(newProject);

    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).send(`A project named "${req.body.name}" already exists. Please choose a different name.`);
        }
        res.status(400).send(err.message || 'Failed to create workspace');
    }



}

export const getAllProject = async (req, res) => {
    try {

        const loggedInUser = await userService.getOrCreateUser(req.user);
        if (!loggedInUser) {
            return res.status(200).json({ projects: [] });
        }

        const allUserProjects = await projectService.getAllProjectByUserId({
            userId: loggedInUser._id
        })

        return res.status(200).json({
            projects: allUserProjects
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { projectId, users, email } = req.body;

        const loggedInUser = await userService.getOrCreateUser(req.user);
        if (!loggedInUser) {
            return res.status(401).json({ error: "User session not found. Please log in again." });
        }

        let targetUserIds = [];
        if (Array.isArray(users)) {
            targetUserIds = [ ...users ];
        }

        if (email && typeof email === 'string' && email.trim()) {
            const foundUser = await userModel.findOne({ email: email.trim().toLowerCase() });
            if (!foundUser) {
                return res.status(404).json({
                    error: `User "${email}" is not registered yet. Copy and share the project invite link with them so they can join upon signup!`
                });
            }
            targetUserIds.push(foundUser._id.toString());
        }

        if (targetUserIds.length === 0) {
            return res.status(400).json({ error: "Please select a user or enter an email to invite." });
        }

        const project = await projectService.addUsersToProject({
            projectId,
            users: targetUserIds,
            userId: loggedInUser._id
        });

        return res.status(200).json({
            project,
            message: "Collaborator added successfully!"
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

export const joinProject = async (req, res) => {
    const { projectId } = req.body;

    try {
        const loggedInUser = await userService.getOrCreateUser(req.user);

        if (!loggedInUser) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const updatedProject = await projectModel.findByIdAndUpdate(
            projectId,
            { $addToSet: { users: loggedInUser._id } },
            { new: true }
        ).populate('users');

        if (!updatedProject) {
            return res.status(404).json({ error: "Project not found" });
        }

        return res.status(200).json({
            project: updatedProject
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

export const getProjectById = async (req, res) => {

    const { projectId } = req.params;

    try {

        const project = await projectService.getProjectById({ projectId });

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}

export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, fileTree } = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}