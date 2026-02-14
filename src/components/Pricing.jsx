import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
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
        <section id="pricing" className="py-24 bg-secondary-50 relative overflow-hidden">
            <div className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] bg-primary-100/40 blur-[120px] rounded-full mix-blend-multiply pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <Badge className="mb-4">Harga Paket</Badge>
                    <h2 className="text-3xl md:text-5xl font-bold text-dark-950 mb-6">Harga simpel, gak pake ribet</h2>
                    <p className="text-lg text-slate-600">
                        Pilih paket yang pas buat kebutuhan bisnismu. Gak ada biaya tersembunyi.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`
                    relative p-8 rounded-[2rem] border transition-all duration-300
                    ${plan.highlight
                                        ? 'bg-white border-primary-200 shadow-2xl shadow-primary-500/20 scale-105 z-10'
                                        : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50 hover:border-primary-100'
                                    }
                `}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-primary-50 text-primary-600 border-primary-200 font-semibold shadow-lg shadow-primary-500/10">Paling Laris</Badge>
                                    </div>
                                )}

                                <h3 className="text-xl font-bold text-dark-950 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className={`font-extrabold text-dark-950 ${plan.price === "Hubungi Kami" ? "text-3xl" : "text-4xl"}`}>{plan.price}</span>
                                    {plan.price !== "Hubungi Kami" && <span className="text-slate-500 font-medium">/bulan</span>}
                                </div>
                                <p className="text-slate-500 mb-8 text-sm leading-relaxed">{plan.description}</p>

                                <div className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <Check className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? 'text-primary-600' : 'text-slate-400'}`} />
                                            <span className="text-slate-600 text-sm font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    variant={plan.highlight ? 'primary' : 'outline'}
                                    className="w-full"
                                >
                                    {plan.price === "Hubungi Kami" ? "Kontak Sales" : "Mulai Sekarang"}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
