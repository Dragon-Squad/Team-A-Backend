class UpdateRaisedAmountDTO {
    constructor({ projectId, amount }) {
        if (!projectId || typeof projectId !== "string") {
            throw new Error("Invalid projectId: must be a non-empty string");
        }
        if (typeof amount !== "number" || amount <= 0) {
            throw new Error("Invalid amount: must be a positive number");
        }

        this.projectId = projectId;
        this.amount = amount;
    }
}

class ProjectResponseDTO {
    constructor(project) {
        this.id = project.id || project._id;
        this.title = project.title;
        this.raisedAmount = project.raisedAmount;
        this.goalAmount = project.goalAmount;
        this.status = project.status;
        this.categoryIds = project.categoryIds;
        this.regionId = project.regionId;
        this.charityId = project.charityId;
        this.startDate = project.startDate;
        this.endDate = project.endDate;
    }
}

module.exports = { UpdateRaisedAmountDTO, ProjectResponseDTO };
