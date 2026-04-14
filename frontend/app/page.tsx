// app/page.tsx
"use client"

import Link from "next/link"
import React, { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 font-serif text-slate-800 antialiased selection:bg-blue-100">
      <AdvancedNavbar scrolled={scrolled} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <AdvancedFooter />
    </div>
  )
}

// Advanced Navbar Component
function AdvancedNavbar({ scrolled, mobileMenuOpen, setMobileMenuOpen }: { 
  scrolled: boolean
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void 
}) {
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Book", href: "/book" },
    { name: "Availability", href: "/availability" },
    { name: "Cancel", href: "/cancel" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled 
          ? "bg-white/85 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-100" 
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="group relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25">
                <span className="text-base font-bold text-white">S</span>
              </div>
              <span className="text-lg font-light tracking-tight text-slate-800">
                Sched<span className="font-semibold text-blue-600">ly</span>
              </span>
            </motion.div>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-0">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative px-3 py-1.5"
              >
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="relative z-10 text-sm font-medium tracking-wide text-slate-600 transition-colors group-hover:text-blue-600"
                >
                  {item.name}
                </motion.span>
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
            ))}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="ml-2"
            >
              <Link href="/book">
                <button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105">
                  Get Started
                </button>
              </Link>
            </motion.div>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="group rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
            </svg>
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: mobileMenuOpen ? "auto" : 0, opacity: mobileMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden md:hidden"
        >
          <div className="space-y-0.5 pb-3 pt-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  )
}

// Hero Section - COMPACT
function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-14 pb-16">
      <div className="absolute inset-0 -z-10">
        <div className="animate-blob absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 opacity-30 blur-3xl"></div>
        <div className="animate-blob animation-delay-2000 absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 opacity-20 blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-600"></span>
            </span>
            AI-Powered Scheduling
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl font-light tracking-tight text-slate-800 sm:text-5xl lg:text-6xl"
        >
          Intelligent{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text font-medium text-transparent">
            Scheduling
          </span>
          <br />
          for Modern Teams
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg"
        >
          Book, cancel, and manage appointments with our voice-enabled AI agent. 
          Seamless, intelligent, and designed to save you hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link href="/book">
            <button className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30">
              <span>Start Scheduling</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </Link>

          <Link href="/availability">
            <button className="rounded-full border border-slate-200 bg-white/70 px-6 py-2.5 text-sm font-medium text-slate-600 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg">
              Check Availability
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// Features Section - COMPACT
function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) controls.start("visible")
  }, [isInView, controls])

  const features = [
    {
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
      title: "Voice AI Integration",
      description: "Powered by VAPI — book, cancel, and check appointments using natural voice commands.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Lightning Fast",
      description: "Built on FastAPI and Next.js for instant responses and seamless user experience.",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z",
      title: "Real-time Updates",
      description: "Appointments sync instantly across all devices with live availability tracking.",
      gradient: "from-purple-500 to-pink-500"
    }
  ]

  return (
    <section ref={ref} className="py-12">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="mb-8 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Features</p>
          <h2 className="mt-1 font-serif text-2xl font-light tracking-tight text-slate-800 sm:text-3xl">
            Everything you need
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={controls}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-lg"
            >
              <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-br ${feature.gradient} p-2 text-white shadow-md`}>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={feature.icon} />
                </svg>
              </div>
              <h3 className="mb-1 font-serif text-lg font-medium text-slate-800">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How It Works Section - COMPACT
function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) controls.start("visible")
  }, [isInView, controls])

  const steps = [
    { 
      step: "01", 
      title: "Speak or Type", 
      desc: "Tell our AI what you need — book, check, or cancel appointments.",
      icon: "M8 12h8M12 8v8M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    { 
      step: "02", 
      title: "AI Processes", 
      desc: "VAPI voice agent connects with our FastAPI backend instantly.",
      icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z M12 5.25V3m0 18v-2.25"
    },
    { 
      step: "03", 
      title: "Get Confirmation", 
      desc: "Receive immediate confirmation and reminders for your appointments.",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    }
  ]

  return (
    <section ref={ref} className="border-y border-slate-100 bg-gradient-to-r from-slate-50 to-white py-12">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="mb-8 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Process</p>
          <h2 className="mt-1 font-serif text-2xl font-light tracking-tight text-slate-800 sm:text-3xl">
            How it works
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              animate={controls}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -4 }}
              className="relative rounded-xl border border-slate-100 bg-white p-5 text-center shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-3 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
              </div>
              <div className="mb-1 font-serif text-3xl font-light text-blue-100">{item.step}</div>
              <h3 className="mb-1 font-serif text-base font-medium text-slate-800">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              
              {index < 2 && (
                <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block">
                  <svg className="h-5 w-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Section - COMPACT
function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) controls.start("visible")
  }, [isInView, controls])

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      content: "Schedly has completely transformed how our team manages appointments.",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Founder, StartupX",
      content: "We've saved countless hours since switching to Schedly. Seamless integration.",
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Healthcare Admin",
      content: "Real-time availability tracking eliminated double-bookings entirely.",
      avatar: "ER"
    }
  ]

  return (
    <section ref={ref} className="py-12">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="mb-8 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Testimonials</p>
          <h2 className="mt-1 font-serif text-2xl font-light tracking-tight text-slate-800 sm:text-3xl">
            Trusted by teams worldwide
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={controls}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-2 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="mb-3 text-sm leading-relaxed text-slate-600">"{testimonial.content}"</p>
              
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-medium text-white">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{testimonial.name}</p>
                  <p className="text-xs text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section - COMPACT
function CTASection() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-center shadow-xl md:p-10"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-500 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-500 blur-3xl"></div>
          </div>
          
          <h2 className="relative font-serif text-2xl font-light text-white sm:text-3xl">
            Ready to automate your scheduling?
          </h2>
          <p className="relative mx-auto mt-1 max-w-lg text-sm text-slate-300">
            Join thousands of teams saving hours every week with Schedly.
          </p>
          <div className="relative mt-5">
            <Link href="/book">
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-medium text-slate-800 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                Get Started Now
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Advanced Footer - COMPACT
function AdvancedFooter() {
  const footerLinks = {
    Product: [
      { name: "Book Appointment", href: "/book" },
      { name: "Check Availability", href: "/availability" },
      { name: "Cancel Appointment", href: "/cancel" }
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Blog", href: "/blog" }
    ],
    Resources: [
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/api" },
      { name: "Support", href: "/support" }
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" }
    ]
  }

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com", icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84", viewBox: "0 0 24 24" },
    { name: "GitHub", href: "https://github.com", icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z", viewBox: "0 0 24 24" },
    { name: "LinkedIn", href: "https://linkedin.com", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z", viewBox: "0 0 24 24" }
  ]

  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                <span className="text-base font-bold text-white">S</span>
              </div>
              <span className="text-lg font-light tracking-tight text-slate-800">
                Sched<span className="font-semibold text-blue-600">ly</span>
              </span>
            </Link>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Intelligent scheduling powered by AI.
            </p>
            <div className="mt-3 flex gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 transition-colors hover:text-blue-600"
                >
                  <span className="sr-only">{social.name}</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox={social.viewBox}>
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{category}</h3>
              <ul className="mt-2 space-y-1.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-xs text-slate-500 transition-colors hover:text-blue-600">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <p className="text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Schedly — Final Year Project. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}