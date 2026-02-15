import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

export default function Pricing() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPlans() {
            const { data, error } = await supabase
                .from('pricing_plans')
                .select('*')
                .order('id', { ascending: true });

            if (!error && data) {
                setPlans(data);
            }
            setLoading(false);
        }
        fetchPlans();
    }, []);

    return (
        <section id="pricing" className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <Badge className="mb-6">Harga Paket</Badge>
                    <h2 className="text-4xl md:text-5xl font-bold text-dark-950 mb-6 tracking-tight">
                        Investasi cerdas untuk<br />
                        <span className="text-primary-600">pertumbuhan bisnis</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Pilih paket yang sesuai dengan skala bisnismu. Upgrade kapan saja seiring pertumbuhanmu.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.15
                                }
                            }
                        }}
                        className={`grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto ${plans.length === 3
                            ? 'lg:grid-cols-3 max-w-5xl'
                            : 'lg:grid-cols-4 max-w-7xl'
                            }`}>
                        {plans.map((plan, index) => (
                            <motion.div
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 50, scale: 0.9 },
                                    show: {
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        transition: {
                                            type: "spring",
                                            stiffness: 50
                                        }
                                    }
                                }}
                                className={`
                                    relative p-8 rounded-[2.5rem] border flex flex-col h-full transition-all duration-300
                                    ${plan.highlight
                                        ? 'bg-blue-50/50 border-blue-200 shadow-2xl shadow-blue-500/10 z-10 ring-1 ring-blue-200'
                                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50'
                                    }
                                `}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-max">
                                        <div className="bg-white border border-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                                            PALING LARIS
                                        </div>
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className={`text-lg font-bold mb-4 ${plan.highlight ? 'text-primary-600' : 'text-dark-950'}`}>
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className={`font-extrabold text-dark-950 tracking-tight ${plan.price === "Hubungi Kami" ? "text-3xl" : "text-4xl lg:text-5xl"}`}>
                                            {plan.price}
                                        </span>
                                    </div>
                                    {plan.price !== "Hubungi Kami" && (
                                        <p className="text-sm text-slate-500 font-medium">per bulan</p>
                                    )}
                                    <p className="text-slate-500 text-sm mt-4 leading-relaxed">
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="space-y-4 mb-8 flex-grow">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className="text-slate-600 text-sm font-medium leading-loose">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    variant={plan.highlight ? 'primary' : 'outline'}
                                    className={`w-full rounded-full py-6 font-bold text-base transition-transform active:scale-95 ${plan.highlight
                                        ? 'shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40'
                                        : 'border-slate-200 text-slate-600 hover:text-primary-600 hover:border-primary-600'
                                        }`}
                                >
                                    {plan.price === "Hubungi Kami" ? "Hubungi Sales" : (plan.highlight ? "Coba Sekarang" : "Pilih Paket")}
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
