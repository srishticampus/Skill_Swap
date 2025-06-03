
import { Button } from "@/components/ui/button";
import { Handshake, Users, User, ArrowRight, ChartNoAxesCombined } from "lucide-react";
import {  Link } from 'react-router';


import heroimg from "./heroimg.jpeg"
import landing1 from "./landing-1.png"
import landing2 from "./landing-2.png"
import landing3 from "./landing-3.png"


export default function Landing(){

  return (
    <>
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
            <Button size="lg" className="rounded-full" asChild>
              <Link to="/signup">Join Community</Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full" asChild>
              <Link to="/about">Learn More</Link>
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
    <section className=" px-4 mx-auto py-16 my-16 bg-[#F6F7F9]">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto">
        {[
          { icon: User, title: "Create Profile", description: "Set up your profile and list the skills you want to share and learn" },
          { icon: Users, title: "Match Partners", description: "AI-powered connect you with the perfect skill exchange partner." },
          { icon: Handshake, title: "Connect & Exchange", description: "Send exchange requests, chat with users, and finalize details." },
          { icon: ChartNoAxesCombined , title: "Track Progress", description: "Monitor your learning journey and celebrate milestones" },
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


    <section className="bg-muted/50 py-16">
      <div className="container px-4 mx-auto">
        <div className="space-y-16">
          {[{
            id: 1,
            title: "AI-Powered Skill Matching",
            description: "Upload your resume, and our AI automatically extracts and categorizes your skills. This ensures you get precise matches, saving time and effort in finding the right skill exchange partner.",
            image: landing1
          }, {
            id: 2,
            title: "Real-time Chat",
            description: "Connect with experienced mChat with users in real-time to finalize exchange details and agreements. Keep track of completed and pending swaps with a structured system for smooth transactions. This helps you connect with the most relevant individuals for an efficient exchange.entors",
            image: landing2
          }, {
            id: 3,
            title: "Progress Tracking",
            description: "Chat with users in real-time to finalize exchange details and agreements. Keep track of completed and pending swaps with a structured system for smooth transactions.",
            image: landing3
          }].map((item) => (
            <div key={item.id} className={`flex flex-col md:flex-row gap-8 items-center ${item.id % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <img
                src={item.image}
                alt="Testimonial"
                width={400}
                height={400}
                className="rounded-xl w-full md:w-1/2"
              />
              <div className="md:w-1/2 space-y-4">
                <h3 className="text-2xl text-primary">{item.title}</h3>
                <p className="text-xl">
                  {item.description}
                </p>
                <div className="font-medium">
                  <Button asChild variant="link" className="text-primary p-0! m-0"><Link to="/login">Learn More <ArrowRight/></Link></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="container px-4 mx-auto py-16 text-center">
      <div className="bg-primary-gradient rounded-2xl p-8 md:p-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-background">Ready to Start Your Skill Exchange Journey?</h2>
        <p className="text-background mb-8">Join thousands of users already sharing and learning new skills</p>
        <Button asChild size="lg" className="rounded-full bg-background text-primary hover:bg-background/80 hover:text-primary/80">
          <Link to="/login">Join Now - It's Free <ArrowRight/></Link>
        </Button>
      </div>
    </section>
</>
  )
}
