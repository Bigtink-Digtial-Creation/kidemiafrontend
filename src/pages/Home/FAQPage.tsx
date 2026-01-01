import { ChevronDown, Mail } from "lucide-react";
import { useState } from "react";

export const FAQPage = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: "What is Kidemia?",
            a: "Kidemia is a digital learning platform designed to help children in transition classes learn smarter through personalized, gamified education."
        },
        {
            q: "What age group is Kidemia for?",
            a: "Kidemia is ideal for children aged 8–14, especially those transitioning from Primary to Secondary school."
        },
        {
            q: "Is Kidemia aligned with the Nigerian curriculum?",
            a: "Yes. Content is curated by educators and aligned with relevant curriculum standards."
        },
        {
            q: "How do subscriptions work?",
            a: "Subscriptions give access to learning content, assessments, analytics, and gamified features. You can cancel anytime."
        },
        {
            q: "Can I track more than one child?",
            a: "Yes. Parent accounts can track multiple children under one dashboard."
        },
        {
            q: "Are there refunds?",
            a: "Subscriptions, tokens, digital downloads, and memberships are non-refundable once access is granted. Please review details before purchase."
        },
        {
            q: "Is my child safe on Kidemia?",
            a: "Yes. Kidemia is a secure, ad-free learning environment with parent-controlled access."
        },
        {
            q: "Do children interact with strangers?",
            a: "No. All interactions are moderated and designed for safe learning."
        },
        {
            q: "Can schools use Kidemia?",
            a: "Yes. Schools can onboard students and access class-level analytics."
        },
        {
            q: "How do I get help?",
            a: "Email us at support@kidemia.net"
        }
    ];

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="bg-white">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .text-kidemia-primary { color: #BF4C20; }
        .text-kidemia-secondary { color: #F28729; }
        .hover\\:text-kidemia-primary:hover { color: #BF4C20; }
        .hover\\:text-kidemia-secondary:hover { color: #F28729; }
      `}</style>

            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-kidemia-primary mb-4">Frequently Asked Questions</h1>
                        <p className="text-gray-600 leading-relaxed">
                            Find answers to common questions about Kidemia.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-200 pb-3">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-start justify-between gap-4 text-left py-3 hover:text-kidemia-primary transition-colors"
                                >
                                    <span className="font-semibold text-gray-800 flex-1">{faq.q}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-kidemia-secondary flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                {openFaq === index && (
                                    <div className="pb-3 pr-8">
                                        <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <section className="space-y-3 bg-gray-50 p-6 rounded-lg mt-8">
                        <h2 className="text-xl font-semibold text-kidemia-primary">Still have questions?</h2>
                        <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="w-5 h-5 text-kidemia-secondary" />
                            <a href="mailto:support@kidemia.net" className="hover:text-kidemia-secondary transition-colors">support@kidemia.net</a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};