const express = require("express");
const ProjectController = require("./ProjectController");
const { authenticate, authorize } = require("../middleware/auth");
const UserType = require("../enum/UserType");
const ProjectRouter = express.Router();

/**
 * @swagger
 * /projects/all:
 *   get:
 *     summary: Get all projects
 *     description: Retrieves a list of all projects with optional filters.
 *     tags: [Project]
 *     parameters:
 *       - in: query
 *         name: charityId
 *         schema:
 *           type: string
 *           example: 675be5b6eecd9bb35ff45598
 *         description: Filter projects by charity ID.
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           example: 675be5bceecd9bb35ff45677
 *         description: Filter projects by category ID.
 *       - in: query
 *         name: regionId
 *         schema:
 *           type: string
 *           example: 675be5bceecd9bb35ff45680
 *         description: Filter projects by region ID.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: "active"
 *         description: Filter projects by status (e.g., active, halted).
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search for projects based on a keyword.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (default is 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of projects per page for pagination (default is 10).
 *     responses:
 *       200:
 *         description: A list of projects matching the filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: The total number of projects.
 *                   example: 1
 *                 page:
 *                   type: integer
 *                   description: The current page number.
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   description: The number of projects per page.
 *                   example: 10
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique ID of the project.
 *                         example: "675be5bceecd9bb35ff45689"
 *                       charityId:
 *                         type: string
 *                         description: The ID of the charity associated with the project.
 *                         example: "675be5b6eecd9bb35ff45598"
 *                       categoryId:
 *                         type: string
 *                         description: The ID of the category associated with the project.
 *                         example: "675be5bceecd9bb35ff45677"
 *                       regionId:
 *                         type: string
 *                         description: The ID of the region associated with the project.
 *                         example: "675be5bceecd9bb35ff45680"
 *                       title:
 *                         type: string
 *                         description: The title of the project.
 *                         example: "Middle East Crisis"
 *                       description:
 *                         type: string
 *                         description: A description of the project.
 *                         example: "Aid for Middle East Crisis"
 *                       goalAmount:
 *                         type: integer
 *                         description: The goal amount for the project.
 *                         example: 1000000
 *                       raisedAmount:
 *                         type: integer
 *                         description: The amount raised so far for the project.
 *                         example: 0
 *                       status:
 *                         type: string
 *                         description: The status of the project (e.g., active, halted).
 *                         example: "active"
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: A list of image URLs for the project.
 *                         example: []
 *                       videos:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: A list of video URLs for the project.
 *                         example: []
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the project was created.
 *                         example: "2024-12-13T07:43:56.939Z"
 *                       __v:
 *                         type: integer
 *                         description: The version key for the project.
 *                         example: 0
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error: Unable to fetch projects"
 */
ProjectRouter.get("/all", ProjectController.getAll);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     description: Creates a new project with the provided data.
 *     tags: [Project]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               charityId:
 *                 type: string
 *                 description: The ID of the charity associated with the project.
 *                 example: 675be5b6eecd9bb35ff45598
 *               categoryId:
 *                 type: string
 *                 description: The ID of the category associated with the project.
 *                 example: 675be5bceecd9bb35ff45677 
 *               regionId:
 *                 type: string
 *                 description: The ID of the region associated with the project.
 *                 example: 675be5bceecd9bb35ff45680
 *               title:
 *                 type: string
 *                 description: The title of the project.
 *                 example: "Middle East Crisis 2"
 *               description:
 *                 type: string
 *                 description: A detailed description of the project.
 *                 example: "Aid for Middle East Crisis"
 *               goalAmount:
 *                 type: number
 *                 format: float
 *                 description: The fundraising goal amount for the project.
 *                 example: 1000000.00
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the project.
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 status:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
ProjectRouter.post(
  "/",
  //   authenticate,
  //   authorize([UserType.ADMIN, UserType.CHARITY]),
  ProjectController.create
);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update a project
 *     description: Updates the details of an existing project by ID.
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the project to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
ProjectRouter.put("/:id", ProjectController.update);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     description: Deletes an existing project by ID.
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the project to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found or status isn't halted
 *       500:
 *         description: Internal server error
 */
ProjectRouter.delete("/:id", ProjectController.delete);

/**
 * @swagger
 * /projects/halt/{id}:
 *   patch:
 *     summary: Halt a project
 *     description: Halts a project by updating its status to "halted".
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the project to halt
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project halted successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
ProjectRouter.patch("/halt/:id", ProjectController.halt);

/**
 * @swagger
 * /projects/resume/{id}:
 *   patch:
 *     summary: Resume a project
 *     description: Resumes a project by updating its status to "active".
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the project to resume
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project resumed successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
ProjectRouter.patch("/resume/:id", ProjectController.resume);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     description: Retrieves a project by its ID.
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the project to retrieve
 *         example: 675be5bceecd9bb35ff45689
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
ProjectRouter.get("/:id", ProjectController.getById);

module.exports = ProjectRouter;
