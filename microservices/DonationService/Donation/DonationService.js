require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

class DonationService {
    async donate(data) {
        const email = data.email;
        const personalMessage = data.message || null;
        let stripeCustomer;
        let customerId = "cus_RPk3Q0QY3NFMwo";
    
        if (!email) {
            throw new Error('No Email provided');
        }
    
        // try {
        //     // Check for existing Stripe customer
        //     const customers = await stripe.customers.list({
        //         email: email,
        //         limit: 1,
        //     });
    
        //     if (customers.data.length > 0) {
        //         customerId = customers.data[0].id;
        //     } else {
        //         // Create a new Stripe customer
        //         const newCustomer = await stripe.customers.create({
        //             email: email,
        //         });
        //         customerId = newCustomer.id;
        //     }
        // } catch (err) {
        //     throw new Error('Failed to retrieve or create customer: ' + err.message);
        // }
    
        // Validate donation amount
        if (typeof data.amount !== 'number' || isNaN(data.amount) || data.amount <= 0) {
            throw new Error('Amount must be a valid positive number');
        }
    
        const isMonthly = data.paymentType === 'monthly';
        const unitAmount = Math.round(data.amount * 100); // Convert to cents
    
        // Create Stripe Checkout session
        try {
            const sessionConfig = {
                customer: customerId,
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Donation',
                                description: 'Thank you for your generous support!',
                            },
                            unit_amount: unitAmount,
                            recurring: isMonthly ? { interval: 'month' } : undefined,
                        },
                        quantity: 1,
                    },
                ],
                mode: isMonthly ? 'subscription' : 'payment',
                success_url: 'http://localhost:5500/success',
                cancel_url: 'http://localhost:5500/cancel',
                metadata: {
                    personal_message: personalMessage || 'No message provided',
                },
            };
    
            const session = await stripe.checkout.sessions.create(sessionConfig);
            return session.url;
        } catch (err) {
            throw new Error('Failed to create Stripe Checkout session: ' + err.message);
        }
    }
    
    verifyEvent(payload, signature) {
        try {
            return stripe.webhooks.constructEvent(
                payload, 
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            throw new Error(`Webhook signature verification failed: ${err.message}`);
        }
    }

    async handleEvent(event) {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log('Payment was successful:', session);
                // const donor = await donorRepository.findByStripeId(session.customer);
                // //TODO: there is 2 cases where donor is not found, or donor is a guest 
                // if (donor) {
                //     await donorRepository.update(donor.id, { totalDonation: donor.totalDonation + session.amount_total });
                // } else {
                //     //TODO: Handle logic here
                // }

                // const project = await projectRepository.findByStripeId(session.metadata.productId);
                // if (!project) {
                //     throw new Error(`Project not found!`)
                // }
                // await projectRepository.update(project.id, { raisedAmount: project.raisedAmount + session.amount_total });
                // break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }
}

module.exports = new DonationService();