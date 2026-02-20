import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
                    <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-slate max-w-none text-slate-600">
                        <p className="lead">
                            Welcome to Vlow Ai! We’re excited to have you as a user of our powerful AI Agent and Customer Relationship Management (CRM) application. Before you get started, please take a moment to read through our Terms and Conditions outlined below.
                        </p>
                        <p>
                            By using our platform, you agree to be bound by these terms. If you do not agree with any part of these terms, please refrain from using Vlow Ai.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">1. Information We Collect</h3>
                        <h4 className="font-semibold text-slate-700 mt-4 mb-2">1.1. Personal Information</h4>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li><strong>Contact Information:</strong> Your name, email address, phone number, and business-related information.</li>
                            <li><strong>Account Information:</strong> Usernames, passwords, and other authentication details.</li>
                            <li><strong>Communication Data:</strong> Content submitted when communicating with us or other users.</li>
                        </ul>

                        <h4 className="font-semibold text-slate-700 mt-4 mb-2">1.2. Usage Information</h4>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li><strong>Device Information:</strong> IP address, device type, operating system, and browser.</li>
                            <li><strong>Usage Analytics:</strong> Usage patterns, feature utilization, and other analytical data.</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">2. How We Use Your Information</h3>
                        <h4 className="font-semibold text-slate-700 mt-4 mb-2">2.1. We use your information for:</h4>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li><strong>Providing Services:</strong> Delivering features, AI automation, and system functionalities.</li>
                            <li><strong>Communication:</strong> Responding to inquiries and providing support.</li>
                            <li><strong>Analytics:</strong> Improving services and optimizing user experience.</li>
                            <li><strong>Marketing:</strong> Sending promotional materials with your consent.</li>
                        </ul>
                        <p className="mb-2">2.2. You must be at least 18 years old to use Vlow Ai and create an account.</p>
                        <p className="mb-4">2.3. You are responsible for maintaining the confidentiality of your account credentials.</p>

                        <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">3. Data Security and Privacy</h3>
                        <p className="mb-2">3.1. We take data security seriously and implement appropriate measures to protect your information.</p>
                        <p className="mb-2">3.2. We handle your personal data in accordance with our Privacy Policy.</p>
                        <p className="mb-4">3.3. You grant us the right to collect and process data related to your platform usage.</p>

                        <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">4. Third-Party API Usage (Google & Meta)</h3>
                        <p className="mb-2">4.1. Our application may integrate with third-party APIs (such as Google Calendar API for scheduling or Meta Graph API for messaging capabilities).</p>
                        <p className="mb-2">4.2. We do not unnecessarily store, process, or share data obtained from these APIs beyond the scope of providing our core automation services to you.</p>
                        <p className="mb-2">4.3. You may revoke access to your connected accounts (e.g., Google or Meta/Facebook) at any time through your respective account security settings.</p>
                        <p className="mb-4">4.4. Our use and transfer of information received from Google APIs adhere to the Google API Services User Data Policy. Our use of Meta APIs strictly follows Meta's Platform Terms and Developer Policies.</p>

                        <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">5. Payment and Subscription</h3>
                        <p className="mb-2">5.1. Certain services or features may require payment. By subscribing, you agree to pay associated fees.</p>
                        <p className="mb-2">5.2. Subscription fees are non-refundable unless stated in our Refund Policy.</p>
                        <p className="mb-4">5.3. We reserve the right to modify subscription fees with advance notice.</p>

                        <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">6. Intellectual Property</h3>
                        <p className="mb-2">6.1. All content and materials on Vlow Ai are our property or our licensors’.</p>
                        <p className="mb-4">6.2. You may not copy, modify, distribute, or reproduce any part without explicit written consent.</p>

                        <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">7. Limitation of Liability</h3>
                        <p className="mb-2">7.1. Vlow Ai is provided “as is” without warranties or guarantees.</p>
                        <p className="mb-4">7.2. We shall not be liable for any direct, indirect, incidental, special, or consequential damages.</p>

                        <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">8. Termination</h3>
                        <p className="mb-2">8.1. You may terminate your account at any time through the account closure process.</p>
                        <p className="mb-4">8.2. We reserve the right to terminate or suspend accounts violating these Terms.</p>

                        <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">9. Contact Us</h3>
                        <p className="mb-2">For questions or concerns about these Terms and Conditions, please contact us at:</p>
                        <p className="font-semibold text-primary-600">Email: support@vlow-ai.com</p>

                        <hr className="my-8 border-slate-200" />
                        <p className="text-sm text-slate-500">
                            By using Vlow Ai, you acknowledge reading and understanding these Terms and Conditions and agree to be bound by them.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
