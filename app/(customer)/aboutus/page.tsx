import Cust_navbar from "@/components/cust_navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | Queueless",
    description: "Queueless is a smart queue management platform built to give people their time back.",
};

const pillars = [
    {
        icon: "⏱",
        title: "Punctuality",
        desc: "Every customer gets a precise slot. No overbooking, no surprises.",
    },
    {
        icon: "📍",
        title: "Location-aware",
        desc: "We confirm your presence within 50 meters before your slot begins.",
    },
    {
        icon: "⚖️",
        title: "Fairness",
        desc: "Missed slots are rebalanced instantly so no one waits longer than they should.",
    },
    {
        icon: "🔒",
        title: "Transparency",
        desc: "Real-time position updates and wait estimates, always visible to the customer.",
    },
];

const stats = [
    { num: "0", label: "Minutes of unnecessary waiting" },
    { num: "Live", label: "Real-time queue updates via SSE" },
    { num: "50m", label: "Location precision radius" },
    { num: "Auto", label: "Slot rebalancing on no-shows" },
];

const team = [
    { initials: "Ab", name: "Abdulhamid (Founder)", role: "Product & Engineering", bg: "#E6F1FB", color: "#0C447C" },
    { initials: "QL", name: "Queueless Labs", role: "Research & Infrastructure", bg: "#E1F5EE", color: "#085041" },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Cust_navbar/>
            <section className="px-6 md:px-16 py-16 border-b border-gray-200">
                <span className="inline-block text-xs font-medium tracking-widest uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-6">
                    About Queueless
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight mb-5">
                    We&apos;re eliminating <span className="italic text-gray-400">the wait</span>,<br />
                    one queue at a time.
                </h1>
                <p className="text-lg font-light text-gray-500 leading-relaxed max-w-2xl">
                    Queueless is a smart queue management platform built to give people their time back —
                    and help businesses serve customers with precision, fairness, and zero chaos.
                </p>
            </section>

            <section className="px-6 md:px-16 py-12 border-b border-gray-200">
                <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">Our Mission</p>
                <h2 className="font-serif text-2xl md:text-3xl font-normal mb-4 leading-snug">
                    Time is the only resource you can&apos;t get back.
                </h2>
                <p className="text-base font-light text-gray-500 leading-relaxed max-w-2xl">
                    We started Queueless because we believe waiting in line is a solved problem. With the right
                    technology, businesses can coordinate their customers intelligently — and customers can show
                    up exactly when they&apos;re needed, not a minute before.
                </p>
                <blockquote className="border-l-2 border-blue-400 pl-5 mt-6">
                    <p className="font-serif text-lg italic text-gray-500 mb-1">
                        &ldquo;No more guessing. No more crowded lobbies. Just seamless,
                        location-aware service — for everyone.&rdquo;
                    </p>
                    <span className="text-xs text-gray-400">— The Queueless Team</span>
                </blockquote>
            </section>

            <section className="px-6 md:px-16 py-12 border-b border-gray-200">
                <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-5">By the numbers</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-gray-50 p-5">
                            <p className="font-serif text-3xl font-normal mb-1">{s.num}</p>
                            <p className="text-xs text-gray-400 font-light leading-snug">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-6 md:px-16 py-12 border-b border-gray-200">
                <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">What we stand for</p>
                <h2 className="font-serif text-2xl md:text-3xl font-normal mb-6 leading-snug">
                    Built on four core principles.
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {pillars.map((p, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                            <div className="text-xl mb-3">{p.icon}</div>
                            <p className="text-sm font-medium mb-2">{p.title}</p>
                            <p className="text-xs text-gray-400 font-light leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-6 md:px-16 py-12 border-b border-gray-200">
                <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">How it works</p>
                <h2 className="font-serif text-2xl md:text-3xl font-normal mb-4 leading-snug">
                    Simple for customers. Powerful for businesses.
                </h2>
                <p className="text-base font-light text-gray-500 leading-relaxed max-w-2xl">
                    Customers discover a business, select their services, and join the queue digitally. Our system
                    tracks their estimated slot in real time — and sends an acknowledgment 10 minutes before their
                    turn. When the moment arrives, a location check confirms they&apos;re nearby, and their slot begins.
                    If someone doesn&apos;t show, the queue rebalances automatically so the next person is served
                    without delay.
                </p>
            </section>

            <section className="px-6 md:px-16 py-12 border-b border-gray-200">
                <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">The team</p>
                <h2 className="font-serif text-2xl md:text-3xl font-normal mb-2 leading-snug">
                    A small team with a big vision.
                </h2>
                <p className="text-base font-light text-gray-500 mb-6">
                    We&apos;re builders, designers, and operators who got tired of standing in line. Queueless is our answer.
                </p>
                <div className="flex flex-wrap gap-3">
                    {team.map((member, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
                                style={{ background: member.bg, color: member.color }}
                            >
                                {member.initials}
                            </div>
                            <div>
                                <p className="text-sm font-medium leading-none mb-1">{member.name}</p>
                                <p className="text-xs text-gray-400">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-6 md:px-16 py-8 text-center">
                <p className="text-xs text-gray-400">
                    Built with Next.js, MongoDB &amp; Inngest &nbsp;·&nbsp;
                    <strong className="text-gray-600 font-medium">Queueless</strong>
                    &nbsp;·&nbsp; Making every minute count.
                </p>
            </section>

        </div>
    );
}