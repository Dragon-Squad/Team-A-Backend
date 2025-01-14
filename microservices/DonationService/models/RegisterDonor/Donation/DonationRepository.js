const Donation = require("./DonationSchema");

class DonationRepository {
    async create(data) {
        const donation = new Donation(data);
        return await donation.save();
    }

    async count() {
        return await Donation.countDocuments();
    }

    async findById(id) {
        return await Donation.findById(id).populate("transactionId");
    }

    async getAll(limit, page) {
        const totalCount = await Donation.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = page;
        const isLast = currentPage >= totalPages;

        const offset = (page - 1) * limit;
        const data = await Donation.find()
            .skip(offset)
            .limit(limit)
            .populate("transactionId");

        return {
            meta: {
                totalPages: totalPages,
                currentPage: currentPage,
                pageSize: limit,
                isLast: isLast,
            },
            data: data,
        };
    }

    async getAllByDonor(limit, page, userId) {
        const totalCount = await Donation.countDocuments({ userId: userId });
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = page;
        const isLast = currentPage >= totalPages;

        const offset = (page - 1) * limit;
        const data = await Donation.find({ userId: userId })
            .skip(offset)
            .limit(limit)
            .populate("transactionId");

        return {
            meta: {
                totalPages: totalPages,
                currentPage: currentPage,
                pageSize: limit,
                isLast: isLast,
            },
            data: data,
        };
    }

    async getAllByProject(limit, page, projectId) {
        const totalCount = await Donation.countDocuments({
            projectId: projectId,
        });
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = page;
        const isLast = currentPage >= totalPages;

        const offset = (page - 1) * limit;
        const data = await Donation.find({ projectId: projectId })
            .skip(offset)
            .limit(limit)
            .populate("transactionId");

        return {
            meta: {
                totalPages: totalPages,
                currentPage: currentPage,
                pageSize: limit,
                isLast: isLast,
            },
            data: data,
        };
    }

    async calculateTotalDonations(projectIds) {
        const donations = await Donation.find({
            projectId: { $in: projectIds },
        }).populate({
            path: "transactionId",
            match: { status: "success" },
            select: "amount",
        });

        const totalDonations = donations.reduce((total, donation) => {
            if (donation.transactionId) {
                total += donation.transactionId.amount;
            }
            return total;
        }, 0);

        return totalDonations;
    }
}

module.exports = new DonationRepository();
