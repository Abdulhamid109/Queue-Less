import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import Cust_navbar from "@/components/cust_navbar";

export const metadata: Metadata = {
    title: "Contact | Queueless",
    description: "Get in touch with the Queueless team. We're here to help.",
};

const contactInfo = [
    {
        icon: Mail,
        label: "Email us",
        value: "hello@queueless.in",
        sub: "We reply within 24 hours",
        href: "mailto:hello@queueless.in",
    },
    {
        icon: MapPin,
        label: "Based in",
        value: "Navi Mumbai, India",
        sub: "Maharashtra, 400701",
        href: null,
    },
    {
        icon: Clock,
        label: "Support hours",
        value: "Mon – Sat, 9am – 6pm",
        sub: "IST (UTC +5:30)",
        href: null,
    },
    {
        icon: MessageSquare,
        label: "Feedback",
        value: "Share your experience",
        sub: "Help us improve the platform",
        href: "/SFeedback",
    },
];

const faqs = [
    {
        q: "How do I join a queue?",
        a: "Search for a business, select your services, and tap Join Queue. You'll receive a notification 10 minutes before your turn.",
    },
    {
        q: "What happens if I miss my slot?",
        a: "If you're not within 50 meters of the business when your slot starts, it will be marked as missed and the next person will be served. You can rejoin the queue.",
    },
    {
        q: "Can I join queues at multiple businesses?",
        a: "Yes. Each business queue is tracked independently, so you can be in multiple queues at the same time.",
    },
    {
        q: "Is Queueless free to use?",
        a: "Queueless is free for customers. Business plans are available for service providers who want advanced analytics and management tools.",
    },
];

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Cust_navbar/>
            {/* Hero */}
            <section className="px-6 md:px-16 py-16 border-b border-gray-200">
                <span className="inline-block text-xs font-medium tracking-widest uppercase text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-6">
                    Contact Us
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight mb-5">
                    Let&apos;s <span className="italic text-gray-400">talk</span>.
                </h1>
                <p className="text-lg font-light text-gray-500 leading-relaxed max-w-xl">
                    Have a question, a suggestion, or just want to say hello?
                    We&apos;re a small team and we read every message.
                </p>
            </section>

            {/* Contact Cards */}
            <section className="px-6 md:px-16 py-12 border-b border-gray-200">
                <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-5">
                    Reach us
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {contactInfo.map((item, i) => {
                        const Icon = item.icon;
                        const content = (
                            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 h-full hover:border-gray-300 transition-colors">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Icon size={15} className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                                    <p className="text-sm font-medium text-gray-900">{item.value}</p>
                                    <p className="text-xs text-gray-400 mt-0.5 font-light">{item.sub}</p>
                                </div>
                            </div>
                        );
                        return item.href ? (
                            <Link key={i} href={item.href} className="h-full">
                                {content}
                            </Link>
                        ) : (
                            <div key={i}>{content}</div>
                        );
                    })}
                </div>
            </section>

            {/* Contact Form */}
            <section className="px-6 md:px-16 py-12 border-b border-gray-200">
                <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
                    Send a message
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-normal mb-8 leading-snug">
                    We&apos;ll get back to you within a day.
                </h2>

                <form className="max-w-2xl flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                                Name
                            </label>
                            <input
                                type="text"
                                placeholder="Your full name"
                                className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                            Subject
                        </label>
                        <input
                            type="text"
                            placeholder="What's this about?"
                            className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                            Message
                        </label>
                        <textarea
                            rows={5}
                            placeholder="Tell us what's on your mind..."
                            className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Send Message
                        </button>
                        <p className="text-xs text-gray-400 font-light">
                            We don&apos;t share your data with anyone.
                        </p>
                    </div>
                </form>
            </section>

            {/* FAQ */}
            <section className="px-6 md:px-16 py-12 border-b border-gray-200">
                <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
                    FAQ
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-normal mb-8 leading-snug">
                    Common questions.
                </h2>
                <div className="max-w-2xl flex flex-col divide-y divide-gray-100">
                    {faqs.map((faq, i) => (
                        <div key={i} className="py-5">
                            <p className="text-sm font-medium text-gray-900 mb-2">{faq.q}</p>
                            <p className="text-sm font-light text-gray-500 leading-relaxed">{faq.a}</p>
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