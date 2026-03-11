"use client";

import React from "react";
import { Check, Warehouse, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { stripeService } from "@/services/stripe.service";

const plans = [
    {
        name: "Starter",
        price: "$49",
        priceId: "price_starter_id", // Replace with real Stripe Price ID
        description: "Perfect for small warehouses looking to digitize.",
        features: [
            "Up to 500 Inventory Items",
            "1 Warehouse Location",
            "2 Staff Accounts",
            "Email Support",
            "Basic Analytics"
        ],
        icon: Warehouse,
        color: "blue"
    },
    {
        name: "Professional",
        price: "$149",
        priceId: "price_pro_id", // Replace with real Stripe Price ID
        description: "Designed for growing businesses with multiple sites.",
        features: [
            "Unlimited Inventory Items",
            "Up to 5 Warehouse Locations",
            "10 Staff Accounts",
            "Priority Support",
            "Advanced Reporting",
            "API Access"
        ],
        icon: Zap,
        color: "purple",
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        priceId: "price_enterprise_id", // Replace with real Stripe Price ID
        description: "Full-scale logistics for global operations.",
        features: [
            "Unlimited Everything",
            "Custom Integrations",
            "Dedicated Account Manager",
            "On-site Training",
            "SLA Guarantee",
            "White-label Options"
        ],
        icon: Shield,
        color: "gold"
    }
];

export default function PricingPage() {
    const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);

    const handleSubscribe = async (priceId: string, planName: string) => {
        setLoadingPlan(planName);
        try {
            await stripeService.createCheckoutSession(priceId);
        } catch (error) {
            console.error("Subscription failed", error);
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8">
            <div className="max-w-6xl mx-auto space-y-12 py-20">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold tracking-tight">Simple, <span className="text-white/50 text-gradient">Scalable</span> Pricing</h1>
                    <p className="text-white/50 text-xl max-w-2xl mx-auto font-light">
                        Choose the plan that fits your logistics needs. No hidden fees, just pure efficiency.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <Card key={plan.name} className={`glass-card border-white/5 overflow-hidden transition-all duration-500 hover:scale-[1.02] ${plan.popular ? 'border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.15)]' : ''}`}>
                            {plan.popular && (
                                <div className="bg-purple-500 text-white text-[10px] uppercase tracking-widest font-bold py-1 text-center">
                                    Most Popular
                                </div>
                            )}
                            <CardHeader>
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                                    <plan.icon className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                <CardDescription className="text-white/40">{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-white/30">/month</span>}
                                </div>
                                <div className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-3 text-sm text-white/60">
                                            <Check className="w-4 h-4 text-green-500" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className={`w-full h-12 rounded-xl transition-all duration-300 font-bold ${plan.popular ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}
                                    onClick={() => handleSubscribe(plan.priceId, plan.name)}
                                    disabled={loadingPlan !== null}
                                >
                                    {loadingPlan === plan.name ? "Processing..." : plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="text-center pt-10">
                    <p className="text-white/30 text-sm flex items-center justify-center gap-2">
                        <Globe className="w-4 h-4" /> Trusted by warehouse managers globally
                    </p>
                </div>
            </div>
        </div>
    );
}
