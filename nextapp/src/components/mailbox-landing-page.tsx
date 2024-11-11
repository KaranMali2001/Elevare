"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart,
  ChevronDown,
  Mail,
  Search,
  Smartphone,
  Star,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

const faqs = [
  {
    question: "What makes this email client unique?",
    answer:
      "Our email client stands out with its intuitive design, powerful features, and seamless integrations. We prioritize user experience and productivity, making email management effortless and efficient.",
  },
  {
    question: "How secure is my data?",
    answer:
      "We employ state-of-the-art encryption and security measures to ensure your data is always protected. Our servers are regularly audited and we follow best practices in data protection and privacy.",
  },
  {
    question: "Can I integrate with other tools?",
    answer:
      "Yes, our email client offers seamless integration with a wide range of popular productivity tools and services. This allows you to streamline your workflow and boost your efficiency.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "We provide comprehensive support including 24/7 customer service, extensive documentation, video tutorials, and a community forum. Our dedicated support team is always ready to assist you with any questions or issues.",
  },
];

const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: any;
  onClick: any;
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div
      className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
    >
      <button
        className="flex justify-between items-center w-full py-5 text-left"
        onClick={onClick}
      >
        <span className="text-lg font-medium">{question}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div
              className={`pb-5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function MailboxLandingPageComponent() {
  const session = useSession();

  const dashOrLoginURL = session.data?.user?.email ? "/dashboard" : "/login";
  const [openFAQIndex, setOpenFAQIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <AnimatePresence>
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex flex-col min-h-screen font-sans ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
        >
          <header
            className={`flex justify-between items-center py-4 px-6 border-b ${isDarkMode ? "bg-gray-800 bg-opacity-80 border-gray-700" : "bg-white bg-opacity-80 border-gray-200"} backdrop-blur-md fixed w-full z-10`}
          >
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-2xl font-bold">
                <Image
                  src="/image.svg"
                  height={140}
                  width={140}
                  alt="Brand Logo"
                ></Image>
              </Link>
              <nav className="hidden md:flex space-x-6">
                {["Features", "Pricing", "Testimonials", "Help"].map(
                  (item, index) => (
                    <Link
                      key={index}
                      href="#"
                      className={`text-sm font-medium ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors duration-200`}
                    >
                      {item}
                    </Link>
                  )
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {/* <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-200 text-gray-700"} transition-colors duration-200`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button> */}
              <Link
                href={dashOrLoginURL}
                className={`text-sm font-medium ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors duration-200`}
              >
                Sign in
              </Link>
              <Link
                href={dashOrLoginURL}
                className={`${isDarkMode ? "bg-white text-gray-900" : "bg-black text-white"} px-4 py-2 rounded-full text-sm font-medium transition-transform duration-200 hover:scale-105`}
              >
                Get Started
              </Link>
            </div>
          </header>

          <main className="flex-grow pt-16">
            <section className="text-center py-20 px-6">
              <motion.h1
                className="text-5xl font-bold mb-4 tracking-tight"
                {...fadeInUp}
              >
                Your Mailbox is simplified
              </motion.h1>
              <motion.p
                className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-8 max-w-2xl mx-auto leading-relaxed`}
                {...fadeInUp}
                transition={{ delay: 0.2 }}
              >
                Experience email like never before. Streamlined, intuitive, and
                designed for the way you work.
              </motion.p>
              <motion.div
                className="flex justify-center space-x-4 mb-12"
                {...fadeInUp}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href={dashOrLoginURL}
                  className={`${isDarkMode ? "bg-white text-gray-900" : "bg-black text-white"} px-6 py-3 rounded-full text-sm font-medium transition-transform duration-200 hover:scale-105`}
                >
                  Get Started
                </Link>
                <Link
                  href="/Demo"
                  className={`${isDarkMode ? "text-white border-gray-600" : "text-black border-gray-300"} border px-6 py-3 rounded-full text-sm font-medium flex items-center transition-transform duration-200 hover:scale-105`}
                >
                  Demo <ChevronDown className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Image
                  // src="/placeholder.svg?height=600&width=800"
                  src="/heroImage.png"
                  alt="Mailbox Interface"
                  width={800}
                  height={600}
                  className="w-full rounded-lg shadow-2xl"
                />
              </motion.div>
            </section>

            <motion.section
              className={`py-20 px-6 ${isDarkMode ? "bg-gray-800" : "bg-[rgb(245,245,247)]"}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12 tracking-tight">
                  Discover Our Amazing Features
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Seamless Integration",
                      icon: <Zap className="w-6 h-6" />,
                      description:
                        "Experience the ease of integrating your existing email system with our AI-driven platform. Our solution ensures smooth synchronization between your emails and business tools, streamlining your workflow without disrupting your current processes.",
                    },
                    {
                      title: "Smart Categorization",
                      icon: <Mail className="w-6 h-6" />,
                      description:
                        "Automatically sort and organize incoming emails into relevant categories, prioritizing important messages and reducing clutter. Our AI-powered categorization helps you focus on what matters most, improving productivity and response times.",
                    },
                    {
                      title: "Powerful Search",
                      icon: <Search className="w-6 h-6" />,
                      description:
                        "Quickly locate any email or attachment using advanced search capabilities. Our system provides instant, accurate results, allowing you to retrieve important information and past communications effortlessly, saving time and boosting efficiency.",
                    },
                    // {
                    //   title: "Secure Backup",
                    //   icon: <Shield className="w-6 h-6" />,
                    //   description:
                    //     "Experience the ease of integrating your existing email system with our AI-driven platform. Our solution ensures smooth synchronization between your emails and business tools, streamlining your workflow without disrupting your current processes.",
                    // },
                    {
                      title: "Advanced Analytics",
                      icon: <BarChart className="w-6 h-6" />,
                      description:
                        "Gain actionable insights into your email interactions with comprehensive analytics. Track email response times, engagement rates, and communication patterns to optimize your strategies and improve overall performance.",
                    },
                    {
                      title: "Mobile Friendly",
                      icon: <Smartphone className="w-6 h-6" />,
                      description:
                        "Stay connected on the go with a mobile-optimized interface that ensures you can manage your emails from any device. Whether you're in the office or traveling, enjoy seamless functionality across smartphones and tablets.",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className={`${isDarkMode ? "bg-gray-700" : "bg-white"} p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div
                        className={`${isDarkMode ? "bg-purple-900" : "bg-purple-100"} p-3 rounded-full inline-block mb-4`}
                      >
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p
                        className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}
                      >
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section
              className="py-20 px-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <motion.div
                    className="md:w-1/2 mb-8 md:mb-0"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-4xl font-bold mb-6 tracking-tight">
                      Stay on top of your business
                    </h2>
                    <ul className="space-y-4">
                      {[
                        "Organize your emails efficiently",
                        "Collaborate with your team seamlessly",
                        "Access your mailbox from anywhere",
                      ].map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center space-x-3 text-lg"
                        >
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white">
                            ✓
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                  <motion.div
                    className="md:w-1/2"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    {/* <Image
                      src="/placeholder.svg?height=600&width=300"
                      alt="Mobile App"
                      width={300}
                      height={600}
                      className="w-full max-w-sm mx-auto rounded-3xl shadow-2xl"
                    /> */}
                  </motion.div>
                </div>
              </div>
            </motion.section>

            <motion.section
              className={`py-20  px-6 ${isDarkMode ? "bg-gray-800" : "bg-[rgb(245,245,247)]"}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <motion.div
                    className="md:w-1/2 mb-8 md:mb-0"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    {/* <Image
                      src="/placeholder.svg?height=600&width=300"
                      alt="Mobile App"
                      width={300}
                      height={600}
                      className="w-full max-w-sm mx-auto rounded-3xl shadow-2xl"
                    /> */}
                  </motion.div>
                  <motion.div
                    className="md:w-1/2"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-4xl font-bold mb-6 tracking-tight">
                      Elevate your email experience
                    </h2>
                    <ul className="space-y-4">
                      {[
                        "Get notified of important emails",
                        "Customize your email workflow",
                        "Integrate with your favorite tools",
                      ].map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center space-x-3 text-lg"
                        >
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white">
                            ✓
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            <motion.section
              className="py-20 px-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12 tracking-tight">
                  Pricing for Everyone
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      name: "Free",
                      price: "0",
                      features: [
                        "1 User",
                        "1GB Storage",
                        "Help Center Access",
                        "Email Support",
                      ],
                    },
                    {
                      name: "Pro",
                      price: "Coming Soon",
                      features: ["...", "...", "..."],
                    },
                    {
                      name: "Enterprise",
                      price: "Coming Soon",
                      features: ["...", "...", "..."],
                    },
                  ].map((plan, index) => (
                    <motion.div
                      key={index}
                      className={`${isDarkMode ? "bg-gray-700" : "bg-white"} p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h3 className="text-2xl font-semibold mb-4">
                        {plan.name}
                      </h3>
                      <div className="text-4xl font-bold mb-6">
                        ${plan.price}
                        <span
                          className={`text-sm font-normal ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          /month
                        </span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center space-x-3"
                          >
                            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span
                              className={
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Link href="/login">
                        <button
                          className={`w-full py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                            index === 1
                              ? isDarkMode
                                ? "bg-white text-gray-900 hover:bg-gray-200"
                                : "bg-black text-white hover:bg-gray-800"
                              : isDarkMode
                                ? "bg-gray-600 text-white hover:bg-gray-500"
                                : "bg-white text-black border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {index === 1 ? "Get Started" : "Sign in"}
                        </button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section
              className={`py-20 px-6 ${isDarkMode ? "bg-gray-800" : "bg-[rgb(245,245,247)]"}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-4 tracking-tight">
                  Love from our customers
                </h2>
                <p
                  className={`text-xl text-center ${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-12`}
                >
                  See what our customers are saying about our product
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, index) => (
                    <motion.div
                      key={index}
                      className={`${isDarkMode ? "bg-gray-700" : "bg-white"} p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        <div>
                          <div className="font-semibold">John Doe</div>
                          <div
                            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                          >
                            CEO at Company
                          </div>
                        </div>
                      </div>
                      <p
                        className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-4 leading-relaxed`}
                      >
                        This email client has revolutionized the way we handle
                        communications. It is intuitive, powerful, and a joy to
                        use every day.
                      </p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className="w-5 h-5 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section
              className="py-20 px-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">
                      Frequently Asked Questions
                    </h2>
                    <p
                      className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-6`}
                    >
                      Here are some of our most frequently asked questions. If
                      you have a question that is not answered here, please feel
                      free to contact us.
                    </p>
                    <Link
                      href="#"
                      className="text-purple-600 font-medium inline-flex items-center hover:underline"
                    >
                      Contact Support
                      <svg
                        className="w-4 h-4 ml-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div>
                    {faqs.map((faq, index) => (
                      <FAQItem
                        key={index}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={index === openFAQIndex}
                        onClick={() =>
                          setOpenFAQIndex(index === openFAQIndex ? -1 : index)
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              className={`py-20 px-6 text-center ${isDarkMode ? "bg-gray-800" : "bg-[rgb(245,245,247)]"}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 tracking-tight">
                Ready to transform your inbox?
              </h2>
              <p
                className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-8 max-w-2xl mx-auto`}
              >
                Join thousands of satisfied users and experience email like
                never before.
              </p>
              <Link
                href="#"
                className={`inline-block ${isDarkMode ? "bg-white text-gray-900 hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 hover:scale-105`}
              >
                Get Started Now
              </Link>
            </motion.section>
          </main>

          <footer
            className={`${isDarkMode ? "bg-gray-900" : "bg-white"} py-12 px-6`}
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap justify-between items-center">
                <Link href="/" className="text-2xl font-bold mb-4 md:mb-0">
                  <Image
                    src="/image.svg"
                    height={200}
                    width={200}
                    alt="Brand Logo"
                  ></Image>
                </Link>
                <nav className="flex flex-wrap justify-center md:justify-end space-x-6">
                  {[
                    "Privacy Policy",
                    "Terms of Service",
                    "Contact Us",
                    "About",
                  ].map((item, index) => (
                    <Link
                      key={index}
                      href="/privacy-policy"
                      className={`text-sm ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors duration-200`}
                    >
                      {item}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
                <div
                  className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-4 md:mb-0`}
                >
                  © 2024 Elevare. All rights reserved.
                </div>
                <div className="flex space-x-6">
                  {["Twitter", "Facebook", "Instagram", "GitHub"].map(
                    (social, index) => (
                      <Link
                        key={index}
                        href="#"
                        className={`text-sm ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors duration-200`}
                      >
                        {social}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </footer>
        </motion.div>
      </AnimatePresence>
    </ThemeContext.Provider>
  );
}
