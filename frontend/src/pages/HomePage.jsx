import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { MessageCircle, Shield, Zap, Users, Lock, Check } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  const features = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Your messages are secured with industry-leading encryption",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time messaging with zero lag, instant delivery",
    },
    {
      icon: Users,
      title: "Group Chats",
      description: "Create groups and chat with multiple friends at once",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data stays yours. No tracking, no data selling",
    },
  ]

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "Unlimited 1-on-1 chats",
        "Group chats (up to 50)",
        "Voice messages",
        "File sharing (10MB)",
      ],
    },
    {
      name: "Pro",
      price: "$9",
      popular: true,
      features: [
        "Everything in Free",
        "Group chats (up to 500)",
        "File sharing (100MB)",
        "Video calls",
        "Custom themes",
        "Priority support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Everything in Pro",
        "Unlimited groups",
        "Advanced admin controls",
        "SSO integration",
        "Dedicated support",
      ],
    },
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-blue-500" />
              <span className="font-bold text-xl">ChatApp</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-500 hover:bg-blue-600">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <motion.section
        style={{ opacity, scale }}
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Connect with{" "}
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                everyone
              </span>
              <br />
              securely and instantly
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The modern chat application that respects your privacy while keeping
              you connected with friends, family, and colleagues.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link to="/register">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                  Start Chatting
                </Button>
              </Link>
              <Link to="/chats">
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-950 h-32 bottom-0 z-10" />
            <div className="bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-2xl p-8 border border-border/50 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm">
                  <div className="text-4xl font-bold text-blue-500">2M+</div>
                  <div className="text-muted-foreground mt-2">Active Users</div>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm">
                  <div className="text-4xl font-bold text-violet-500">500M+</div>
                  <div className="text-muted-foreground mt-2">Messages Sent</div>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm">
                  <div className="text-4xl font-bold text-emerald-500">99.9%</div>
                  <div className="text-muted-foreground mt-2">Uptime</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why choose ChatApp?</h2>
            <p className="text-xl text-muted-foreground">
              Built with security, speed, and simplicity in mind
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-slate-100 dark:to-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that works for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-card border rounded-2xl p-8 relative ${
                  plan.popular
                    ? "border-blue-500 shadow-xl scale-105"
                    : "border-border/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-500 to-violet-500 rounded-3xl p-12 text-white"
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join millions of users already chatting on ChatApp
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="secondary">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/chats">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Try Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-foreground">ChatApp</span>
          </div>
          <p>© 2024 ChatApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
