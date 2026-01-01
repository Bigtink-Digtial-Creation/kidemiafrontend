import { Mail } from 'lucide-react';

export const PrivacyPolicyPage = () => {
    return (
        <div className="bg-white">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .text-kidemia-primary { color: #BF4C20; }
        .text-kidemia-secondary { color: #F28729; }
        .hover\\:text-kidemia-secondary:hover { color: #F28729; }
      `}</style>

            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-kidemia-primary mb-2">Privacy Policy</h1>
                        <p className="text-gray-500 text-sm mb-4">Last updated: 27th Dec, 2025</p>
                        <p className="text-gray-600 leading-relaxed">
                            Kidemia values your privacy and is committed to protecting the personal information of parents, guardians, and children.
                        </p>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">1. Information We Collect</h2>
                        <p className="text-gray-700 leading-relaxed">We may collect:</p>
                        <ul className="space-y-2 text-gray-700 pl-5">
                            <li className="leading-relaxed">• Parent/guardian name, email, phone number</li>
                            <li className="leading-relaxed">• Child's first name, age, class level</li>
                            <li className="leading-relaxed">• Learning progress and assessment results</li>
                            <li className="leading-relaxed">• Device and usage data</li>
                            <li className="leading-relaxed">• Payment information (processed securely by third-party providers)</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">2. How We Use Information</h2>
                        <p className="text-gray-700 leading-relaxed">We use the collected information to:</p>
                        <ul className="space-y-2 text-gray-700 pl-5">
                            <li className="leading-relaxed">• Provide learning services</li>
                            <li className="leading-relaxed">• Personalize learning experiences</li>
                            <li className="leading-relaxed">• Track academic progress</li>
                            <li className="leading-relaxed">• Communicate with parents</li>
                            <li className="leading-relaxed">• Improve platform performance</li>
                        </ul>
                        <p className="text-gray-700 font-semibold mt-4">We do not sell or rent personal data.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">3. Children's Privacy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Kidemia is designed for children under parental supervision.
                        </p>
                        <p className="text-gray-700 font-medium">Parents control:</p>
                        <ul className="space-y-2 text-gray-700 pl-5">
                            <li className="leading-relaxed">• Account access</li>
                            <li className="leading-relaxed">• Data visibility</li>
                            <li className="leading-relaxed">• Child participation</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">4. Data Protection</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use industry-standard security measures to protect data. However, no system is 100% secure.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">5. Third-Party Services</h2>
                        <p className="text-gray-700 leading-relaxed">We may use trusted third-party tools for:</p>
                        <ul className="space-y-2 text-gray-700 pl-5">
                            <li className="leading-relaxed">• Payments</li>
                            <li className="leading-relaxed">• Analytics</li>
                            <li className="leading-relaxed">• Communication</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-2">
                            These providers comply with data protection standards.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">6. Your Rights</h2>
                        <p className="text-gray-700 leading-relaxed">Parents may:</p>
                        <ul className="space-y-2 text-gray-700 pl-5">
                            <li className="leading-relaxed">• Request access to stored data</li>
                            <li className="leading-relaxed">• Request correction or deletion</li>
                            <li className="leading-relaxed">• Withdraw consent</li>
                        </ul>
                    </section>

                    <section className="space-y-3 bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-kidemia-primary">Contact</h2>
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





