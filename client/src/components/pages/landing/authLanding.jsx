
import { Button } from "@/components/ui/button";
import {  MapPin, Star, BriefcaseBusiness } from "lucide-react"
import {  Link } from 'react-router';


import heroimg from "./heroimg.jpeg"
import pfp from "@/assets/pfp.jpeg"


export default function AuthLanding(){

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

    {/* Pick an Exchange Section */}
    <section className="py-16 bg-gray-200 mt-16">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl mb-8">Pick an Exchange</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: 1,
              image: pfp,
              name: "John Doe",
              skills: ["React", "JavaScript", "Web Design"],
              location: "San Francisco",
              experience: "5+ years",
              rating: 4.5,
              serviceRequested: "Frontend Development",
              serviceOffered: "Web Design",
            },
            {
              id: 2,
              image: pfp,
              name: "Jane Smith",
              skills: ["Python", "Data Analysis", "Machine Learning"],
              location: "New York",
              experience: "3+ years",
              rating: 4.8,
              serviceRequested: "Data Science Tutoring",
              serviceOffered: "Python Programming",
            },
            {
              id: 3,
              image: pfp,
              name: "Mike Johnson",
              skills: ["Marketing", "SEO", "Social Media"],
              location: "Los Angeles",
              experience: "7+ years",
              rating: 4.2,
              serviceRequested: "Content Creation",
              serviceOffered: "Digital Marketing",
            },
          ].map((exchange) => (
            <div key={exchange.id} className="bg-card rounded-xl overflow-hidden">
              <div className="flex items-start p-4">
                <img
                  src={exchange.image}
                  alt={exchange.name}
                  className="w-44 h-44 rounded-lg object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-primary">{exchange.name}</h3>
                  <p className="text-sm">{exchange.skills.join(", ")}</p>
                  <hr className="my-2" />
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2"><MapPin className="h-5 w-5" /> {exchange.location}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2"><BriefcaseBusiness className="h-5 w-5" />{exchange.experience}</p>
                  <p className="text-sm text-muted-foreground flex"> {
                    new Array(5).fill(0).map((_, i) => {
                      return (
                        <Star
                          key={i}
                          className={`h-5 w-5 text-yellow-500 ${i+1 < exchange.rating ? "fill-current" : ""}`}
                          aria-hidden="true"
                        />
                      )
                    })
                  }</p>
                </div>
              </div>

              <div className="border border-border m-2 p-2 rounded-lg flex justify-evenly">
                <div className="">
                  <p className="text-sm text-foreground">Service Requested:</p>
                  <p className="text-sm text-primary">
                    {exchange.serviceRequested}
                  </p>
                </div>
                <div className="seperator border-r "/>
                <div className="">
                  <p className="text-sm text-foreground">Service Offered:</p>
                  <p className="text-sm text-primary">
                    {exchange.serviceOffered}
                  </p>
                </div>
              </div>
              <div className="flex justify-between p-4">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button size="sm">
                  Place a Request
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  )
}
