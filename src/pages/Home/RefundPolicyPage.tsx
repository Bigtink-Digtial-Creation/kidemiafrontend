import { Mail, Globe } from 'lucide-react';

export const RefundPolicyPage = () => {
    return (
        <div className="bg-white">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .text-kidemia-primary { color: #BF4C20; }
        .bg-kidemia-primary { background-color: #BF4C20; }
        .text-kidemia-secondary { color: #F28729; }
        .border-kidemia-secondary { border-color: #F28729; }
        .hover\\:text-kidemia-secondary:hover { color: #F28729; }
      `}</style>

            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-kidemia-primary mb-4">Refund Policy</h1>
                        <p className="text-gray-600 leading-relaxed">
                            At Kidemia, we provide digital learning services, subscriptions, and downloadable educational resources. Please review this policy carefully before making any purchase.
                        </p>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">1. Subscriptions (Monthly, Termly, Annual)</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Once a subscription is activated and access to Kidemia's learning platform is granted, subscriptions are non-refundable.
                        </p>
                        <p className="text-gray-700 font-medium">This includes access to:</p>
                        <ul className="space-y-2 text-gray-700 pl-5">
                            <li className="leading-relaxed">• Kidemia Pro learning content</li>
                            <li className="leading-relaxed">• Assessments and analytics</li>
                            <li className="leading-relaxed">• Gamified challenges and leaderboards</li>
                            <li className="leading-relaxed">• Parent dashboards</li>
                            <li className="leading-relaxed">• AI tutoring features</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed">
                            You may cancel your subscription at any time to stop future billing. Access will remain active until the end of the current billing period.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">2. Token-Based Purchases</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Tokens used to unlock premium tests, analytics, or special learning experiences are non-refundable and non-transferable once credited to an account.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">3. Digital Products & Downloadables</h2>
                        <p className="text-gray-700 font-medium">This includes:</p>
                        <ul className="space-y-2 text-gray-700 pl-5">
                            <li className="leading-relaxed">• Templates</li>
                            <li className="leading-relaxed">• Worksheets</li>
                            <li className="leading-relaxed">• Activity packs</li>
                            <li className="leading-relaxed">• Guides</li>
                            <li className="leading-relaxed">• Printable resources</li>
                            <li className="leading-relaxed">• Digital toolkits</li>
                        </ul>
                        <div className="bg-orange-50 border-l-4 border-kidemia-secondary p-4 rounded mt-4">
                            <p className="text-gray-700 font-semibold">All digital products are final sale and non-refundable.</p>
                            <p className="text-gray-700 mt-2">Once a digital file has been downloaded or access granted, it cannot be returned or exchanged.</p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">4. Exclusive Memberships & Special Access Programs</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Exclusive memberships (including communities, clubs, cohorts, or premium access programs) are non-refundable once access is granted, whether used fully or partially.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">5. Exceptions (Limited Cases)</h2>
                        <p className="text-gray-700 leading-relaxed">Refunds may be considered only if:</p>
                        <ul className="space-y-2 text-gray-700 pl-5">
                            <li className="leading-relaxed">• A duplicate payment was made</li>
                            <li className="leading-relaxed">• A technical error prevented access after payment</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed">
                            Requests must be submitted within 7 days of purchase with proof of payment.
                        </p>
                    </section>

                    <section className="space-y-3 bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-kidemia-primary">Contact</h2>
                        <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="w-5 h-5 text-kidemia-secondary" />
                            <a href="mailto:support@kidemia.net" className="hover:text-kidemia-secondary transition-colors">support@kidemia.net</a>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <Globe className="w-5 h-5 text-kidemia-secondary" />
                            <a href="https://www.kidemia.net" target="_blank" rel="noopener noreferrer" className="hover:text-kidemia-secondary transition-colors">www.kidemia.net</a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};