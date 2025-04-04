
import { Button } from "@/components/ui/button";
import { Book, Users, MessageCircle, Globe, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { useLocation, Link } from 'react-router';

import skillswap from "@/assets/skillswap.svg";
import heroimg from "./heroimg.jpeg"

export default function Landing() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex items-center justify-between px-4 py-3 mx-auto">
        <img src={skillswap} alt="skillswap" className="my-5 rounded-full" />

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/" ? "text-primary" : ""}`}>
              Home
            </Link>
            <Link to="/community" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/community" ? "text-primary" : ""}`}>
              Community
            </Link>
            <Link to="/courses" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/courses" ? "text-primary" : ""}`}>
              Courses
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-full">
              Sign In
            </Button>
            <Button className="rounded-full">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container px-4 mx-auto mt-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl xl:text-6xl tracking-tight text-foreground">
              Exchange Skills.<br/> Build Connections.<br/> <span className="text-primary">Grow Together.</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Join a community where learning meets collaboration
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="rounded-full">
                Join Community
              </Button>
              <Button variant="outline" size="lg" className="rounded-full">
                Learn More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src={heroimg}
              alt="People collaborating"
              width={600}
              height={600}
              className="rounded-xl shadow-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container px-4 mx-auto py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Book, title: "Learn Skills", description: "Access curated courses and tutorials" },
            { icon: Users, title: "Mentorship", description: "Connect with experienced mentors" },
            { icon: MessageCircle, title: "Collaborate", description: "Work on projects with peers" },
            { icon: Globe, title: "Global Network", description: "Join a worldwide community" },
          ].map((feature, index) => (
            <div key={index} className="p-6 bg-card rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="mb-4 bg-gradient-to-b from-primary/60 to-primary w-min  p-3 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <feature.icon className="w-8 h-8 text-white " />
              </div>
              <h3 className="text-lg text-primary mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/50 py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="space-y-16">
            {[1, 2].map((item) => (
              <div key={item} className={`flex flex-col md:flex-row gap-8 items-center ${item % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <img
                  src={`/placeholder.svg?height=400&width=400&text=Testimonial+${item}`}
                  alt="Testimonial"
                  width={400}
                  height={400}
                  className="rounded-xl w-full md:w-1/2"
                />
                <div className="md:w-1/2 space-y-4">
                  <p className="text-xl italic text-muted-foreground">
                    "This community transformed my learning journey. I went from novice to confident developer in 6 months!"
                  </p>
                  <div className="font-medium">
                    <p className="text-foreground">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Full-stack Developer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 mx-auto py-16 text-center">
        <div className="bg-primary/10 rounded-2xl p-8 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of members transforming their skills</p>
          <Button size="lg" className="rounded-full">
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/5 mt-16">
        <div className="container px-4 mx-auto py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2">
              <span className="text-xl font-bold text-foreground">SkillSwap</span>
              <p className="text-sm text-muted-foreground">Empowering learners worldwide</p>
            </div>

            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            © 2024 SkillSwap. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
