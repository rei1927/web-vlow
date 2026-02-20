import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsAndConditions() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms and Conditions</h1>
                    <p className="text-slate-500 mb-8">Last updated on 20 Feb 2026</p>

                    <div className="prose prose-slate max-w-none text-slate-600">
                        <h2 className="text-xl font-bold text-slate-900 uppercase mb-4">TERMS AND CONDITIONS OF VLOW AI PRODUCT USAGE</h2>

                        <p>
                            Thank you for Your trust in using Vlow Ai’s products. By using any services and/or products provided by Vlow Ai (“Vlow”), hereby You, the company and/or business where You have given permission or authorization to represent You (“User”) agree to the following Terms and Conditions of Vlow Product Usage as well as the terms, policies, and other related documentation as implemented by Vlow from time to time (“Terms and Conditions”).
                        </p>
                        <p>
                            Vlow may review and amend these Terms and Conditions from time to time at Vlow’s sole discretion. The User acknowledges and agrees that the User is obliged to check these Terms and Conditions from time to time to be aware of the latest conditions or information regarding the terms of Product usage provided by Vlow.
                        </p>

                        <h3 className="text-lg font-semibold text-slate-800 mt-8 mb-4">I. General Terms</h3>
                        <p className="mb-4">These General Terms apply to all Users who use any Product (as defined below) provided by Vlow.</p>

                        <h4 className="font-semibold text-slate-700 mt-4 mb-2">A. General Definition</h4>
                        <ul className="list-none space-y-4 mb-6">
                            <li><strong>BAST</strong> means Minutes of Handover, a document signed by the Parties after the Training has been carried out which states that the Product can be used by the User.</li>
                            <li><strong>Intellectual Property Rights</strong> mean patents, copyrights, trademarks, and other related rights as defined by applicable law.</li>
                            <li><strong>Confidential Information</strong> means all business-related information of Vlow that has been or will be provided to the User, including but not limited to product design, financial information, and marketing plans.</li>
                            <li><strong>Trial Service</strong> means a Product service provided to Users with certain limitations as referred to under these Terms and Conditions.</li>
                            <li><strong>Active Period</strong> means the active period of Product subscription based on the package paid by the User.</li>
                            <li><strong>Force Majeure</strong> means unforeseeable circumstances that prevent the Parties from fulfilling their obligations under these Terms and Conditions.</li>
                            <li><strong>Usage Agreement</strong> means an agreement for the use of the Product signed by the Parties which details the terms of Product usage.</li>
                            <li><strong>Party</strong> means Vlow or User.</li>
                            <li><strong>Product</strong> means the product offered and provided by Vlow, including but not limited to AI Agent, WhatsApp Business API, Omnichannel, and CRM Application.</li>
                            <li><strong>Quotation</strong> means a document issued by Vlow to the User, regulating the Product package selected by the User.</li>
                        </ul>

                        <h4 className="font-semibold text-slate-700 mt-4 mb-2">B. Package Details, Fees, and Payments</h4>
                        <p className="mb-4">The User acknowledges, understands, and agrees that the details of the Product package selected by the User are as stated in the Quotation and/or the Usage Agreement.</p>

                        <h4 className="font-semibold text-slate-700 mt-4 mb-2">C. User Representations and Warranties</h4>
                        <p className="mb-2">The User represents and warrants that:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li>The User is competent and authorized to agree to these Terms and Conditions.</li>
                            <li>The User has obtained all necessary licenses for the obligations under these Terms and Conditions.</li>
                            <li>There are no ongoing legal actions that could materially affect the User’s ability to perform its obligations under these Terms and Conditions.</li>
                            <li>The User complies with all applicable anti-bribery and anti-corruption regulations.</li>
                            <li>The User guarantees that it has obtained valid consent from personal data owners whose data is provided to Vlow in relation to the Product usage.</li>
                            <li>The User guarantees to always comply with the terms, conditions, and privacy policies that apply to each Product.</li>
                        </ul>

                        <h4 className="font-semibold text-slate-700 mt-4 mb-2">D. Indemnification and Limitation of Liability</h4>
                        <p className="mb-4">
                            Vlow shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our Products. The User agrees to indemnify and hold Vlow harmless from any claims or demands made by any third party due to or arising out of the User's breach of these Terms and Conditions.
                        </p>

                        <h3 className="text-lg font-semibold text-slate-800 mt-8 mb-4">II. Data Security and Privacy</h3>
                        <p className="mb-2"><strong>Legal Disclosure:</strong> We may disclose your information if required by law or when we believe such action is necessary to protect our rights or comply with legal proceedings.</p>
                        <p className="mb-2"><strong>Data Security:</strong> Vlow implements industry-standard security measures to protect your personal information from unauthorized access, loss, misuse, or alteration. While we take reasonable precautions, no method of data transmission over the internet or electronic storage is entirely secure. Therefore, we cannot guarantee absolute security.</p>
                        <p className="mb-2"><strong>Third-Party Links:</strong> Vlow may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these websites. Please review their privacy policies before using them.</p>
                        <p className="mb-4"><strong>Children’s Privacy:</strong> Vlow is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us to delete it.</p>

                        <h3 className="text-lg font-semibold text-slate-800 mt-8 mb-4">III. Changes to this Document</h3>
                        <p className="mb-4">We may update these Terms and Conditions from time to time. Any changes will be posted on this page, and the “Last updated” date will be revised accordingly.</p>

                        <h3 className="text-lg font-semibold text-slate-800 mt-8 mb-4">IV. Contact Us</h3>
                        <p className="mb-2">If you have any questions, concerns, or requests regarding these Terms and Conditions, please contact us at:</p>
                        <p className="font-semibold text-primary-600">Email: support@vlow-ai.com</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
