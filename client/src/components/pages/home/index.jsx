
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Briefcase, Star } from "lucide-react";
import { Link } from 'react-router';
import heroimg from '../landing/heroimg.jpeg';

// Placeholder data - replace with actual data fetching later
const pickExchangeData = [
  { id: 1, name: "Abilash A", skills: "Python, Java", location: "123 city, trivandrum", experience: "3+ years Experience", rating: 3, required: "Web Designing", offered: "Testing", image: "/placeholder-avatar.png" },
  { id: 2, name: "Abilash A", skills: "Python, Java", location: "123 city, trivandrum", experience: "3+ years Experience", rating: 4, required: "Web Designing", offered: "Testing", image: "/placeholder-avatar.png" },
  { id: 3, name: "Abilash A", skills: "Python, Java", location: "123 city, trivandrum", experience: "3+ years Experience", rating: 5, required: "Web Designing", offered: "Testing", image: "/placeholder-avatar.png" },
  { id: 4, name: "Abilash A", skills: "Python, Java", location: "123 city, trivandrum", experience: "3+ years Experience", rating: 4, required: "Web Designing", offered: "Testing", image: "/placeholder-avatar.png" },
  { id: 5, name: "Abilash A", skills: "Python, Java", location: "123 city, trivandrum", experience: "3+ years Experience", rating: 3, required: "Web Designing", offered: "Testing", image: "/placeholder-avatar.png" },
  { id: 6, name: "Abilash A", skills: "Python, Java", location: "123 city, trivandrum", experience: "3+ years Experience", rating: 4, required: "Web Designing", offered: "Testing", image: "/placeholder-avatar.png" },
];

const relatedExchangeData = [
    { id: 7, name: "Abilash A", skills: "Python, Java", location: "123 city, trivandrum", experience: "3+ years Experience", rating: 5, required: "Web Designing", offered: "Testing", image: "/placeholder-avatar.png" },
    { id: 8, name: "Abilash A", skills: "Python, Java", location: "123 city, trivandrum", experience: "3+ years Experience", rating: 4, required: "Web Designing", offered: "Testing", image: "/placeholder-avatar.png" },
    { id: 9, name: "Abilash A", skills: "Python, Java", location: "123 city, trivandrum", experience: "3+ years Experience", rating: 3, required: "Web Designing", offered: "Testing", image: "/placeholder-avatar.png" },
    { id: 10, name: "Abilash A", skills: "Python, Java", location: "123 city, trivandrum", experience: "3+ years Experience", rating: 5, required: "Web Designing", offered: "Testing", image: "/placeholder-avatar.png" },
    { id: 11, name: "Abilash A", skills: "Python, Java", location: "123 city, trivandrum", experience: "3+ years Experience", rating: 4, required: "Web Designing", offered: "Testing", image: "/placeholder-avatar.png" },
    { id: 12, name: "Abilash A", skills: "Python, Java", location: "123 city, trivandrum", experience: "3+ years Experience", rating: 3, required: "Web Designing", offered: "Testing", image: "/placeholder-avatar.png" },
  ];


// Reusable Star Rating Component
const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);

// Reusable Exchange Card Component
const ExchangeCard = ({ exchange, actionType }) => (
    <div className="bg-card rounded-xl shadow-sm border p-4 flex flex-col space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <img src={exchange.image} alt={exchange.name} className="w-16 h-16 rounded-full object-cover border" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{exchange.name}</h3>
          <p className="text-sm text-muted-foreground">{exchange.skills}</p>
        </div>
      </div>
       <div className="border-t pt-3 space-y-1.5">
         <div className="flex items-center text-sm text-muted-foreground gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{exchange.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground gap-1.5">
            <Briefcase className="w-4 h-4" />
            <span>{exchange.experience}</span>
          </div>
          <StarRating rating={exchange.rating} />
        </div>
       <div className="border-t pt-3 grid grid-cols-2 gap-2 text-sm">
         <div>
           <p className="text-muted-foreground mb-1">Service required</p>
           <p className="font-medium text-primary">{exchange.required}</p>
         </div>
         <div>
           <p className="text-muted-foreground mb-1">Service Offered</p>
           <p className="font-medium text-primary">{exchange.offered}</p>
         </div>
       </div>
       <div className="pt-2 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">View Details</Button>
        <Button size="sm" className="flex-1">
          {actionType === 'request' ? 'Place a Request' : 'Swap Now'}
        </Button>
       </div>
    </div>
  );


export default function Home(){

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
              Swap your skills, connect with like-minded people, and track your progress—all in one place.
            </p>
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
    <section className="container px-4 mx-auto py-16">
        <h2 className="text-3xl font-semibold mb-6 text-foreground">Pick an Exchange</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pickExchangeData.map(exchange => (
                <ExchangeCard key={exchange.id} exchange={exchange} actionType="request" />
            ))}
        </div>
        <div className="text-center mt-8">
            <Button variant="link" className="text-primary" asChild>
                <Link to="/exchange-skills">View More <ArrowRight className="ml-1 w-4 h-4" /></Link>
            </Button>
        </div>
    </section>


     {/* Exchanges related to your skills Section */}
     <section className="container px-4 mx-auto py-16 bg-muted/30 rounded-lg">
        <h2 className="text-3xl font-semibold mb-6 text-foreground">Exchanges related to your skills...</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedExchangeData.map(exchange => (
                <ExchangeCard key={exchange.id} exchange={exchange} actionType="swap" />
            ))}
        </div>
        <div className="text-center mt-8">
            <Button variant="link" className="text-primary" asChild>
                <Link to="/exchange-skills/related">View More <ArrowRight className="ml-1 w-4 h-4" /></Link>
            </Button>
        </div>
    </section>
    </>
  )
}
