require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function createOrRetrieveMonthlyProduct(monthlyDonationId, unitAmount) {
    const existingProducts = await stripe.products.list();
    let product = existingProducts.data.find(
        (p) => p.name === `${monthlyDonationId}`
    );

    if (!product) {
        product = await stripe.products.create({
            name: `${monthlyDonationId}`,
            description: "Thank you for your generous support!",
        });

        // Create the recurring price
        await stripe.prices.create({
            unit_amount: unitAmount,
            currency: "usd",
            recurring: { interval: "month" },
            product: product.id,
        });
    }
    return product;
}

async function attachPaymentMethod(customerId) {
    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
    });

    if (paymentMethods.data.length > 0) {
        const paymentMethod = paymentMethods.data[0].id;
        await stripe.paymentMethods.attach(paymentMethod, {
            customer: customerId,
        });

        // Set the attached payment method as the default
        await stripe.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethod,
            },
        });
    }
}

async function createOrRetrieveOneTimeProduct(unitAmount) {
    const existingProducts = await stripe.products.list();
    let product = existingProducts.data.find(
        (p) => p.name === "One-Time Donation"
    );

    if (!product) {
        product = await stripe.products.create({
            name: "One-Time Donation",
            description: "Thank you for your generous support!",
        });
    }

    // Check if a price already exists for this product and unit amount
    const existingPrices = await stripe.prices.list({ product: product.id });
    let price = existingPrices.data.find(
        (p) => p.unit_amount === unitAmount && !p.recurring
    );

    if (!price) {
        price = await stripe.prices.create({
            unit_amount: unitAmount,
            currency: "usd",
            product: product.id,
        });
    }

    return { product, price };
}

function createSessionConfig(
    customerId,
    monthlyDonationId,
    personalMessage,
    projectId,
    amount,
    userId,
    donorType,
    userEmail,
    monthlyAmount
) {
    const today = new Date();
    let billingCycleAnchor = new Date(
        today.getFullYear(),
        today.getMonth(),
        15
    );
    if (today.getDate() > 15) {
        billingCycleAnchor.setMonth(billingCycleAnchor.getMonth() + 1);
    }
    const billingCycleAnchorTimestamp = Math.floor(
        billingCycleAnchor.getTime() / 1000
    );

    return {
        customer: customerId,
        mode: monthlyDonationId ? "subscription" : "payment",
        subscription_data: monthlyDonationId
            ? {
                  billing_cycle_anchor: billingCycleAnchorTimestamp,
                  proration_behavior: "none",
              }
            : undefined,
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cancel",
        metadata: {
            personal_message: personalMessage || "No message provided",
            projectId: projectId,
            monthlyDonationId: monthlyDonationId || null,
            amount: amount,
            userId: userId,
            donorType: donorType,
            renewDate: billingCycleAnchor,
            userEmail: userEmail,
            monthlyAmount: monthlyAmount,
        },
    };
}

async function createDonationSession(
    customerId,
    monthlyDonationId,
    unitAmount,
    personalMessage,
    projectId,
    userId,
    donorType,
    userEmail,
    monthlyAmount = null
) {
    if (!unitAmount || typeof unitAmount !== "number" || unitAmount <= 0) {
        throw new Error(
            "Invalid unitAmount. It must be a positive number representing the smallest currency unit."
        );
    }

    await attachPaymentMethod(customerId);

    let sessionConfig = createSessionConfig(
        customerId,
        monthlyDonationId,
        personalMessage,
        projectId,
        unitAmount,
        userId,
        donorType,
        userEmail,
        monthlyAmount
    );

    if (monthlyDonationId) {
        const product = await createOrRetrieveMonthlyProduct(
            monthlyDonationId,
            unitAmount
        );

        sessionConfig.line_items = [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: `${monthlyDonationId}`,
                    },
                    unit_amount: unitAmount,
                    recurring: { interval: "month" },
                },
                quantity: 1,
            },
        ];
    } else {
        const { product, price } = await createOrRetrieveOneTimeProduct(
            unitAmount
        );

        sessionConfig.line_items = [
            {
                price: price.id,
                quantity: 1,
            },
        ];
    }

    return await stripe.checkout.sessions.create(sessionConfig);
}

async function cancelSubscription(subscriptionId, atPeriodEnd = false) {
    try {
        const canceledSubscription = await stripe.subscriptions.cancel(
            subscriptionId
        );

        console.log("Subscription canceled:", canceledSubscription);
        return canceledSubscription;
    } catch (error) {
        console.error("Error canceling subscription:", error.message);
        throw new Error("Failed to cancel the subscription");
    }
}

module.exports = { createDonationSession, cancelSubscription };
