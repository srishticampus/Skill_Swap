
import React, { useState, useEffect, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, MapPin, Briefcase, Star, Handshake, Users, User, ChartNoAxesCombined } from "lucide-react";
import { Link } from 'react-router';
import heroimg from '../landing/heroimg.jpeg';
import landing1 from '../landing/landing-1.png';
import landing2 from '../landing/landing-2.png';
import landing3 from '../landing/landing-3.png';
import axios from '@/api/axios';
import { toast } from "sonner";
import { AuthContext } from '@/context/AuthContext';


// Reusable Star Rating Component
const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);

// Reusable Exchange Card Component
const ExchangeCard = ({ exchange, actionType, handlePlaceRequest, placingRequest }) => (
    <div className="bg-card rounded-xl shadow-sm border p-4 flex flex-col space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <img src={exchange.createdBy?.profilePicture ? `${import.meta.env.VITE_API_URL}/${exchange.createdBy.profilePicture}` : "/placeholder-avatar.png"} alt={exchange.createdBy?.name} className="w-16 h-16 rounded-full object-cover border" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{exchange.createdBy?.name || 'N/A'}</h3>
          <p className="text-sm text-muted-foreground">{exchange.createdBy?.skills?.join(', ') || 'N/A'}</p>
        </div>
      </div>
       <div className="border-t pt-3 space-y-1.5">
         <div className="flex items-center text-sm text-muted-foreground gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{exchange.createdBy?.city || 'N/A'}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground gap-1.5">
            <Briefcase className="w-4 h-4" />
            <span>{exchange.createdBy?.yearsOfExperience ? `${exchange.createdBy.yearsOfExperience}+ years Experience` : 'N/A'}</span>
          </div>
          <StarRating rating={exchange.rating || 0} /> {/* Rating is still placeholder */}
        </div>
       <div className="border-t pt-3 grid grid-cols-2 gap-2 text-sm">
         <div>
           <p className="text-muted-foreground mb-1">Service required</p>
           <p className="font-medium text-primary">{exchange.serviceRequired || 'N/A'}</p>
         </div>
         <div>
           <p className="text-muted-foreground mb-1">Service Offered</p>
           <p className="font-medium text-primary">{exchange.serviceTitle || 'N/A'}</p>
         </div>
       </div>
       <div className="pt-2 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild><Link to={`/exchange-skills/${exchange._id}`}>View Details</Link></Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => handlePlaceRequest(exchange._id)}
          disabled={exchange.hasPlacedRequest || placingRequest}
        >
          {exchange.hasPlacedRequest ? (
            "Request Placed"
          ) : placingRequest ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Placing...
            </>
          ) : (
            "Place a Request"
          )}
        </Button>
       </div>
    </div>
  );

// No Data Section Component (similar to landing page features/testimonials)
const NoDataSection = () => (
  <>
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
  </>
);


export default function Home() {
  const { user } = useContext(AuthContext);
  const [pickExchangeData, setPickExchangeData] = useState([]);
  const [relatedExchangeData, setRelatedExchangeData] = useState([]);
  const [loadingPickExchanges, setLoadingPickExchanges] = useState(true);
  const [loadingRelatedExchanges, setLoadingRelatedExchanges] = useState(true);
  const [error, setError] = useState(null);
  const [placingRequest, setPlacingRequest] = useState(false); // Track if a request is being placed

  const handlePlaceRequest = async (swapRequestId) => {
    setPlacingRequest(true);
    console.log('swapRequestId:', swapRequestId);
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      if (!token) {
        console.error('No token provided');
        toast("Error", {
          variant: "destructive",
          description: "No token provided. Please log in.",
        })
        return;
      }

      const response = await axios.post(`/api/swap-requests/${swapRequestId}/place-request`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Request placed:', response.data);
      toast("Success", {
        description: "Request placed successfully!",
      })
      // Optionally, update the UI to reflect that the request has been placed
      // For example,
    } catch (error) {
      console.error('Error placing request:', error);
      toast("Error", {
        variant: "destructive",
        description: String(error.response?.data?.message || "Failed to place request."),
      })
      // Handle error, e.g., show an error message to the user
    } finally {
      setPlacingRequest(false);
    }
  };

  useEffect(() => {
    const fetchPickExchanges = async () => {
      try {
        const url = user ? `/api/marketplace/pick-exchanges?excludeUserId=${user._id}` : '/api/marketplace/pick-exchanges';
        const response = await axios.get(url);
        setPickExchangeData(response.data);
      } catch (err) {
        console.error("Error fetching pick exchanges:", err);
        setError(err);
      } finally {
        setLoadingPickExchanges(false);
      }
    };

    const fetchRelatedExchanges = async () => {
      try {
        const url = user ? `/api/marketplace/related-exchanges?excludeUserId=${user._id}` : '/api/marketplace/related-exchanges';
        const response = await axios.get(url);
        setRelatedExchangeData(response.data);
      } catch (err) {
        console.error("Error fetching related exchanges:", err);
        setError(err);
      } finally {
        setLoadingRelatedExchanges(false);
      }
    };

    fetchPickExchanges();
    fetchRelatedExchanges();
  }, [user]); // Add user to dependency array to refetch when user data changes


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
        {loadingPickExchanges ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-card rounded-xl shadow-sm border p-4 flex flex-col space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="border-t pt-3 space-y-1.5">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="border-t pt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="pt-2 flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </div>
            ))}
          </div>
        ) : pickExchangeData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pickExchangeData.map(exchange => (
                  <ExchangeCard key={exchange._id} exchange={exchange} actionType="request" handlePlaceRequest={handlePlaceRequest} placingRequest={placingRequest} />
              ))}
          </div>
        ) : (
          <NoDataSection />
        )}
        {pickExchangeData.length > 0 && (
          <div className="text-center mt-8">
              <Button variant="link" className="text-primary" asChild>
                  <Link to="/exchange-skills">View More <ArrowRight className="ml-1 w-4 h-4" /></Link>
              </Button>
          </div>
        )}
    </section>


     {/* Exchanges related to your skills Section */}
     <section className="container px-4 mx-auto py-16 bg-muted/30 rounded-lg">
        <h2 className="text-3xl font-semibold mb-6 text-foreground">Exchanges related to your skills...</h2>
        {loadingRelatedExchanges ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-card rounded-xl shadow-sm border p-4 flex flex-col space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="border-t pt-3 space-y-1.5">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="border-t pt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="pt-2 flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </div>
            ))}
          </div>
        ) : relatedExchangeData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedExchangeData.map(exchange => (
                  <ExchangeCard key={exchange._id} exchange={exchange} actionType="swap" handlePlaceRequest={handlePlaceRequest} placingRequest={placingRequest} />
              ))}
          </div>
        ) : (
          <NoDataSection />
        )}
        {relatedExchangeData.length > 0 && (
          <div className="text-center mt-8">
              <Button variant="link" className="text-primary" asChild>
                  <Link to="/exchange-skills/related">View More <ArrowRight className="ml-1 w-4 h-4" /></Link>
              </Button>
          </div>
        )}
    </section>
    </>
  )
}
