const GuestDonation = require("./GuestDonationSchema");

class GuestDonationRepository {
    async create(data) {
        const guestDonation = new GuestDonation(data);
        return await guestDonation.save();
    }

    async count() {
        return await GuestDonation.countDocuments();
    }

    async findById(id) {
        return await GuestDonation.findById(id).populate("transactionId");
    }

    async getAll(limit, page) {
        const totalCount = await GuestDonation.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = page;
        const isLast = currentPage >= totalPages;

        const offset = (page - 1) * limit;
        const data = await GuestDonation.find()
            .skip(offset)
            .limit(limit)
            .populate("transactionId")
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
        const totalCount = await GuestDonation.countDocuments({
            projectId: projectId,
        });
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = page;
        const isLast = currentPage >= totalPages;

        const offset = (page - 1) * limit;
        const data = await GuestDonation.find({ projectId: projectId })
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
}

module.exports = new GuestDonationRepository();
