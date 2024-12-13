const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

class DonationService {
    async donate(id, data) {
        const donor = data.donor;
        const project = data.project;

        // Check if data.amount is a number and if it's an integer or a double
        if (typeof data.amount !== 'number' || isNaN(data.amount)) {
            throw new Error('Amount must be a valid number');
        }

        // Determine if donation is monthly
        const isMonthly = data.paymentType === 'monthly';
        // Configure session
        const sessionConfig = {
            customer: donor.stripeId,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product: project.stripeId,
                        unit_amount: data.amount,
                        recurring: isMonthly ? { interval: 'month' } : undefined,
                    },
                    quantity: 1,
                },
            ],
            custom_fields: [
                {
                    key: 'message',
                    label: {
                        type: 'custom',
                        custom: 'Leave your message',
                    },
                    type: 'text',
                    optional: true,
                },
            ],
            metadata: {
                productId: project.stripeId,
            },
            mode: isMonthly ? 'subscription' : 'payment',
            subscription_data: isMonthly
                ? {
                    billing_cycle_anchor: billingCycleAnchorTimestamp,
                    proration_behavior: 'none',
                }
                : undefined,
            // Change the url later
            success_url: 'http://localhost:5500/success',
            cancel_url: 'http://localhost:5500/cancel',
            saved_payment_method_options: {
                payment_method_save: 'enabled',
            },
        };

        const session = await stripe.checkout.sessions.create(sessionConfig);
        return session.url;
    }
}

module.exports = new DonationService();