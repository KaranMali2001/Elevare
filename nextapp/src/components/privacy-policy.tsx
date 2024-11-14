"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Shield } from "lucide-react";
import Link from "next/link";

export function PrivacyPolicyComponent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-gray-600" />
              <span className="text-xl font-semibold text-gray-800">
                Elevare Privacy Policy
              </span>
            </Link>
            <a
              href="mailto:rohit2khairmode2024@gmail.com"
              className="flex items-center text-sm text-gray-600 hover:text-gray-800"
            >
              <Mail className="h-4 w-4 mr-1" />
              Contact Us
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <section>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Privacy Policy
              </h1>
              <p className="text-gray-700">
                At Elevare, we are committed to protecting your privacy. This
                Privacy Policy explains how we collect, use, share, and
                safeguard your personal information when you use our services.
                By using our website and services, you agree to the collection
                and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Information We Collect
              </h2>
              <p className="text-gray-700 mb-2">
                We collect personal data when you interact with our platform or
                use our services. This includes the following information:
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Personal Identifiable Information (PII):
              </h3>
              <p className="text-gray-700 mb-2">
                Name, email address, and other contact information obtained when
                you sign up for our services or provide it during communication
                with us.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Google Account Information:
              </h3>
              <p className="text-gray-700 mb-2">
                When you grant permission to access your Google Account, we
                collect the following information as authorized by the scopes
                provided:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-2">
                <li>
                  Primary Google Account Email Address: The email address
                  associated with your primary Google Account.
                </li>
                <li>
                  Profile Information: Any personal information that you have
                  made publicly available, such as your name and profile
                  picture.
                </li>
                <li>
                  Gmail Permissions: If you grant access to the Gmail modify
                  scope (https://www.googleapis.com/auth/gmail.modify), we
                  collect data necessary to read, compose, and send emails on
                  your behalf.
                </li>
              </ul>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Email Data:
              </h3>
              <p className="text-gray-700 mb-2">
                With your permission, we collect and process email data such as
                message content, metadata, attachments, and email addresses for
                purposes such as smart summarization, custom knowledge
                integration, and AI-powered reply assistance.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Technical Data:
              </h3>
              <p className="text-gray-700">
                Information about how you interact with our services, such as
                your IP address, browser type, operating system, and usage logs,
                to improve the functionality and security of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-2">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700">
                <li>
                  Service Delivery: To provide the core functionalities of our
                  email management platform, including smart summarization,
                  AI-powered replies, automated response libraries, and email
                  analytics.
                </li>
                <li>
                  Personalization: To customize the solutions we provide by
                  integrating your business-specific knowledge and data into
                  AI-generated responses.
                </li>
                <li>
                  Communication: To send you service-related communications,
                  updates, and promotional materials (you can opt out of
                  marketing emails at any time).
                </li>
                <li>
                  Security and Optimization: To maintain and improve the
                  security, performance, and reliability of our services.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Third-Party Access and Sharing
              </h2>
              <p className="text-gray-700 mb-2">
                We do not sell or rent your personal data to third parties.
                However, we may share your information in the following cases:
              </p>
              <ul className="list-disc list-inside text-gray-700">
                <li>
                  Google Integration: We use Google APIs to access your Gmail
                  account for the purpose of providing services like reading,
                  composing, and sending emails. Your email data is accessed
                  only when you explicitly grant us the required permissions.
                </li>
                <li>
                  Service Providers: We work with trusted third-party service
                  providers (such as Vultr for cloud storage and hosting) to
                  deliver our services. These providers have access to the
                  minimum amount of personal information necessary to perform
                  their tasks and are bound by data protection obligations.
                </li>
                <li>
                  Legal Compliance: We may disclose personal data if required by
                  law or in response to valid legal processes (such as subpoenas
                  or government requests).
                </li>
                <li>
                  Business Transfers: In the event of a merger, acquisition, or
                  asset sale, your personal information may be transferred as
                  part of that transaction.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Your Rights and Choices
              </h2>
              <p className="text-gray-700 mb-2">
                You have the following rights regarding your personal
                information:
              </p>
              <ul className="list-disc list-inside text-gray-700">
                <li>
                  Access: You can request to view the personal data we hold
                  about you.
                </li>
                <li>
                  Correction: You can ask us to correct any inaccuracies in your
                  data.
                </li>
                <li>
                  Deletion: You have the right to request that we delete your
                  personal information, subject to any legal or contractual
                  obligations.
                </li>
                <li>
                  Consent Withdrawal: You can revoke your consent for specific
                  data access permissions at any time, particularly those
                  granted via your Google account, through Googles security
                  settings.
                </li>
                <li>
                  Opt-Out: You can unsubscribe from non-essential emails by
                  following the unsubscribe instructions included in such
                  communications.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Data Security and Storage
              </h2>
              <p className="text-gray-700">
                We prioritize the security of your data and take appropriate
                technical and organizational measures to protect it. We store
                your information using secure servers hosted by trusted
                providers like Vultr. We encrypt sensitive data and utilize
                industry-standard security measures to prevent unauthorized
                access, disclosure, or modification.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Retention of Information
              </h2>
              <p className="text-gray-700">
                We retain personal data only for as long as necessary to provide
                our services or as required by law. Once your data is no longer
                needed, we will securely delete or anonymize it.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Google Workspace APIs
              </h2>
              <p className="text-gray-700">
                Google Workspace APIs are not used to develop, improve, or train
                generalized AI and/or ML models. Our application does not retain
                user data obtained through Workspace APIs for such purposes.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                limited use requirement policy
              </h2>
              <p className="text-gray-700">
                Our application adheres to the limited use requirement policy,
                and we ensure that user data is used solely for the intended
                purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Childrens Privacy
              </h2>
              <p className="text-gray-700">
                Our services are not directed at individuals under the age of
                13, and we do not knowingly collect personal information from
                children. If we discover that we have collected personal data
                from a child, we will take steps to delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                International Data Transfers
              </h2>
              <p className="text-gray-700">
                Since Elevare is based in India, your personal data may be
                processed or transferred to India or other locations where our
                servers and partners operate. We ensure that international data
                transfers comply with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Changes to This Policy
              </h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page, and the Effective Date will be
                updated accordingly. We encourage you to review this policy
                periodically to stay informed about how we are protecting your
                data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Contact Us
              </h2>
              <p className="text-gray-700">
                If you have any questions or concerns about this Privacy Policy
                or how we handle your personal data, please contact us:
              </p>
              <p className="text-gray-700 mt-2">
                Elevare
                <br />
                Developer Email:{" "}
                <a
                  href="mailto:rohit2khairmode2024@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  rohit2khairmode2024@gmail.com
                </a>
              </p>
            </section>
          </div>
        </ScrollArea>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <p className="text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Elevare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
