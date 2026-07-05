'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
    const router = useRouter()
    const [mode, setMode] = useState('login') // 'login' | 'register'
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setError('')
        if (!form.email || !form.password) { setError('All fields required'); return }
        if (mode === 'register' && !form.name) { setError('Name required'); return }

        setLoading(true)
        await new Promise(r => setTimeout(r, 600))

        if (mode === 'register') {
            // Save user locally
            const userId = 'u_' + Math.random().toString(36).slice(2, 8)
            localStorage.setItem('mentara_user', JSON.stringify({
                userId, name: form.name, email: form.email, password: form.password
            }))
            router.push('/onboard')
        } else {
            // Login check
            const saved = localStorage.getItem('mentara_user')
            if (!saved) { setError('No account found. Please register.'); setLoading(false); return }
            const user = JSON.parse(saved)
            if (user.email !== form.email || user.password !== form.password) {
                setError('Invalid email or password'); setLoading(false); return
            }
            const onboarded = localStorage.getItem('mentara_onboarded')
            router.push(onboarded ? '/dashboard' : '/onboard')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center p-5">

            {/* Brand */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6750a4] to-[#7C6FFF] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xl">psychology</span>
                </div>
                <div>
                    <h1 className="text-xl font-black tracking-tighter text-[#cfbcff]" style={{ fontFamily: 'Geist' }}>MENTARA</h1>
                    <p className="text-[10px] text-[#948e9c]" style={{ fontFamily: 'JetBrains Mono' }}>AI STARTUP MENTOR · COGNEE MEMORY</p>
                </div>
            </div>

            {/* Card */}
            <div className="w-full max-w-sm bg-[#141218] border border-[#494551]/30 rounded-2xl p-7">

                {/* Tabs */}
                <div className="flex gap-1 mb-6 p-1 bg-[#211f24] rounded-xl">
                    {['login', 'register'].map(m => (
                        <button key={m} onClick={() => { setMode(m); setError('') }}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all capitalize
                ${mode === m ? 'bg-[#6750a4] text-white' : 'text-[#948e9c] hover:text-[#e6e0e9]'}`}
                            style={{ fontFamily: 'JetBrains Mono' }}>
                            {m}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {mode === 'register' && (
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-[#948e9c] mb-1.5" style={{ fontFamily: 'JetBrains Mono' }}>Full Name</label>
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Yash Yadav"
                                className="w-full bg-[#211f24] border border-[#494551]/30 rounded-lg px-3 py-2.5 text-[#e6e0e9] text-sm focus:outline-none focus:border-[#6750a4]/60 placeholder:text-[#494551]" />
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#948e9c] mb-1.5" style={{ fontFamily: 'JetBrains Mono' }}>Email</label>
                        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                            placeholder="yash@example.com"
                            className="w-full bg-[#211f24] border border-[#494551]/30 rounded-lg px-3 py-2.5 text-[#e6e0e9] text-sm focus:outline-none focus:border-[#6750a4]/60 placeholder:text-[#494551]" />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#948e9c] mb-1.5" style={{ fontFamily: 'JetBrains Mono' }}>Password</label>
                        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                            placeholder="••••••••"
                            className="w-full bg-[#211f24] border border-[#494551]/30 rounded-lg px-3 py-2.5 text-[#e6e0e9] text-sm focus:outline-none focus:border-[#6750a4]/60 placeholder:text-[#494551]" />
                    </div>

                    {error && (
                        <div className="px-3 py-2 bg-[#93000a]/20 border border-[#ffb4ab]/20 rounded-lg">
                            <p className="text-[#ffb4ab] text-xs" style={{ fontFamily: 'JetBrains Mono' }}>{error}</p>
                        </div>
                    )}

                    <button onClick={handleSubmit} disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-[#6750a4] to-[#7C6FFF] hover:opacity-90 active:scale-[0.98] transition-all rounded-xl font-bold text-white text-sm disabled:opacity-50"
                        style={{ fontFamily: 'JetBrains Mono' }}>
                        {loading ? '...' : mode === 'login' ? 'LOGIN →' : 'CREATE ACCOUNT →'}
                    </button>
                </div>

                <p className="text-center text-[11px] text-[#948e9c] mt-4">
                    {mode === 'login' ? "Don't have account? " : "Already registered? "}
                    <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
                        className="text-[#cfbcff] hover:underline">
                        {mode === 'login' ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>

            <p className="text-[10px] text-[#494551] mt-6" style={{ fontFamily: 'JetBrains Mono' }}>
                Powered by Cognee · Persistent AI Memory
            </p>
        </div>
    )
}