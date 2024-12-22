require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

async function createOrRetrieveProduct(monthlyDonationId, unitAmount) {
    const existingProducts = await stripe.products.list();
    let product = existingProducts.data.find(p => p.name === `${monthlyDonationId}`);

    if (!product) {
        product = await stripe.products.create({
            name: `${monthlyDonationId}`,
            description: 'Thank you for your generous support!',
        });

        // Create the recurring price
        await stripe.prices.create({
            unit_amount: unitAmount,
            currency: 'usd',
            recurring: { interval: 'month' },
            product: product.id,
        });
    }
    return product;
}

async function attachPaymentMethod(customerId) {
    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
    });

    if (paymentMethods.data.length > 0) {
        const paymentMethod = paymentMethods.data[0].id;
        await stripe.paymentMethods.attach(paymentMethod, { customer: customerId });

        // Set the attached payment method as the default
        await stripe.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethod,
            },
        });
    }
}

function createSessionConfig(customerId, monthlyDonationId, personalMessage, projectId) {
    return {
        customer: customerId,
        mode: monthlyDonationId ? 'subscription' : 'payment', 
        success_url: 'http://localhost:5500/success',
        cancel_url: 'http://localhost:5500/cancel',
        metadata: {
            personal_message: personalMessage || 'No message provided',
            projectId: projectId,
            monthlyDonationId: monthlyDonationId || null 
        },
    };
}

async function createDonationSession(customerId, monthlyDonationId, unitAmount, personalMessage, projectId) {
    await attachPaymentMethod(customerId);

    // Create sessionConfig outside the conditional block to ensure it's always defined
    let sessionConfig = createSessionConfig(customerId, monthlyDonationId, personalMessage, projectId);

    if (monthlyDonationId) {
        const product = await createOrRetrieveProduct(monthlyDonationId, unitAmount);

        sessionConfig.line_items = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `${monthlyDonationId}`,
                },
                unit_amount: unitAmount,
                recurring: { interval: 'month' }, 
            },
            quantity: 1,
        }];
    } else {
        sessionConfig.line_items = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Donation',
                    description: 'Thank you for your generous support!',
                },
                unit_amount: unitAmount,
            },
            quantity: 1,
        }];
    }

    return await stripe.checkout.sessions.create(sessionConfig);
}


module.exports = { createDonationSession };