export const TermsOfServicePage = () => {
    return (
        <div className="bg-white">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .text-kidemia-primary { color: #BF4C20; }
      `}</style>

            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-kidemia-primary mb-4">Terms of Service</h1>
                        <p className="text-gray-600 leading-relaxed">
                            By accessing or using Kidemia, you agree to these Terms.
                        </p>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">1. Use of Platform</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Kidemia is for educational purposes only. Accounts must be created by parents or guardians.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">2. Account Responsibility</h2>
                        <p className="text-gray-700 leading-relaxed">Parents are responsible for:</p>
                        <ul className="space-y-2 text-gray-700 pl-5">
                            <li className="leading-relaxed">• Account security</li>
                            <li className="leading-relaxed">• Child usage</li>
                            <li className="leading-relaxed">• Accurate information</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">3. Intellectual Property</h2>
                        <p className="text-gray-700 leading-relaxed">
                            All content, designs, quizzes, videos, templates, and tools belong to Kidemia and may not be copied, resold, or redistributed.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">4. Payments & Billing</h2>
                        <p className="text-gray-700 leading-relaxed">
                            All payments are processed securely. Subscriptions auto-renew unless canceled.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">5. Prohibited Use</h2>
                        <p className="text-gray-700 leading-relaxed">Users may not:</p>
                        <ul className="space-y-2 text-gray-700 pl-5">
                            <li className="leading-relaxed">• Share login details</li>
                            <li className="leading-relaxed">• Attempt to hack or misuse the platform</li>
                            <li className="leading-relaxed">• Upload harmful or inappropriate content</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">6. Limitation of Liability</h2>
                        <p className="text-gray-700 leading-relaxed">Kidemia is not liable for:</p>
                        <ul className="space-y-2 text-gray-700 pl-5">
                            <li className="leading-relaxed">• Academic outcomes</li>
                            <li className="leading-relaxed">• Internet connectivity issues</li>
                            <li className="leading-relaxed">• Device compatibility issues</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-kidemia-primary">7. Modifications</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Kidemia reserves the right to update services or policies at any time.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};