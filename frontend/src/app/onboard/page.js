'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function OnboardPage() {
    const router = useRouter()
    const [stage, setStage] = useState('early')
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        businessName: '', businessType: 'Food & Beverage',
        location: '', mainProblem: '', monthlyRevenue: '₹0 (Pre-revenue)'
    })

    useEffect(() => {
        if (!localStorage.getItem('mentara_user')) router.replace('/auth')
        if (localStorage.getItem('mentara_onboarded')) router.replace('/dashboard')
    }, [])

    const handleSubmit = async () => {
        if (!form.businessName) return
        setLoading(true)

        const user = JSON.parse(localStorage.getItem('mentara_user') || '{}')
        const sessionId = 's_' + Math.random().toString(36).slice(2, 8)

        const payload = {
            user_id: user.userId,
            business_name: form.businessName,
            business_type: form.businessType,
            location: form.location,
            stage,
            main_problem: form.mainProblem,
            monthly_revenue: form.monthlyRevenue
        }

        try {
            await fetch(`${API}/api/onboard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
        } catch (e) { /* demo mode */ }

        localStorage.setItem('mentara_onboarded', 'true')
        localStorage.setItem('mentara_session', sessionId)
        localStorage.setItem('mentara_profile', JSON.stringify({ ...form, stage }))
        router.push('/dashboard')
        setLoading(false)
    }

    const stages = [
        { v: 'idea', label: '💡 Idea' },
        { v: 'early', label: '🌱 Early' },
        { v: 'growing', label: '📈 Growing' },
        { v: 'scaling', label: '🚀 Scaling' },
    ]

    const types = ['Food & Beverage', 'Retail / Shop', 'Service Business', 'Manufacturing', 'Tech / App', 'Agriculture', 'Other']
    const revenues = ['₹0 (Pre-revenue)', '₹1 – ₹10,000', '₹10,000 – ₹50,000', '₹50,000 – ₹2,00,000', '₹2,00,000+']

    return (
        <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center p-5">

            {/* Brand */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6750a4] to-[#7C6FFF] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xl">psychology</span>
                </div>
                <div>
                    <h1 className="text-xl font-black tracking-tighter text-[#cfbcff]" style={{ fontFamily: 'Geist' }}>MENTARA</h1>
                    <p className="text-[10px] text-[#948e9c]" style={{ fontFamily: 'JetBrains Mono' }}>INITIALIZE VENTURE PROFILE</p>
                </div>
            </div>

            {/* Card */}
            <div className="w-full max-w-md bg-[#141218] border border-[#494551]/30 rounded-2xl p-7">
                <h2 className="text-base font-semibold text-[#e6e0e9] mb-5">Tell me about your startup</h2>

                <div className="space-y-4">
                    <Field label="Venture Name">
                        <input value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })}
                            placeholder="e.g. Meera Tiffin Service" className={inp} />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Sector">
                            <select value={form.businessType} onChange={e => setForm({ ...form, businessType: e.target.value })} className={inp}>
                                {types.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </Field>
                        <Field label="Location">
                            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                                placeholder="City, State" className={inp} />
                        </Field>
                    </div>

                    <Field label="Venture Stage">
                        <div className="flex gap-2 flex-wrap">
                            {stages.map(s => (
                                <button key={s.v} type="button" onClick={() => setStage(s.v)}
                                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all
                    ${stage === s.v
                                            ? 'border-[#6750a4]/60 bg-[#6750a4]/15 text-[#cfbcff] font-semibold'
                                            : 'border-[#494551]/30 text-[#948e9c] hover:border-[#6750a4]/40'}`}
                                    style={{ fontFamily: 'JetBrains Mono' }}>
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </Field>

                    <Field label="Primary Challenge">
                        <textarea value={form.mainProblem} onChange={e => setForm({ ...form, mainProblem: e.target.value })}
                            rows={2} placeholder="e.g. High delivery cost, low customer acquisition..."
                            className={inp + ' resize-none'} />
                    </Field>

                    <Field label="Monthly Revenue">
                        <select value={form.monthlyRevenue} onChange={e => setForm({ ...form, monthlyRevenue: e.target.value })} className={inp}>
                            {revenues.map(r => <option key={r}>{r}</option>)}
                        </select>
                    </Field>

                    <button onClick={handleSubmit} disabled={loading || !form.businessName}
                        className="w-full py-3 bg-gradient-to-r from-[#6750a4] to-[#7C6FFF] hover:opacity-90 active:scale-[0.98] transition-all rounded-xl font-bold text-white text-sm disabled:opacity-50"
                        style={{ fontFamily: 'JetBrains Mono' }}>
                        {loading ? 'Initializing...' : 'LAUNCH MENTARA →'}
                    </button>
                </div>
            </div>
        </div>
    )
}

const inp = "w-full bg-[#211f24] border border-[#494551]/30 rounded-lg px-3 py-2.5 text-[#e6e0e9] text-sm focus:outline-none focus:border-[#6750a4]/60 placeholder:text-[#494551]"

function Field({ label, children }) {
    return (
        <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#948e9c] mb-1.5" style={{ fontFamily: 'JetBrains Mono' }}>{label}</label>
            {children}
        </div>
    )
}