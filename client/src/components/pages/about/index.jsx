
import heroimg from "./hero.png"
import rocket from "./rocket.svg"
import sunrise from "./sunrise.svg"
const About = () => {
  const features = [
    "No Money Needed:Exchange skills and services without financial constraints",
    "Real-Time Chat:Connect instantly with skill partners for seamless collaboration",
    "AI-Powered Matching:Smart algorithms extract and categorize skills for precise matches",
    "Diverse Skill Categories:From coding to art, swap skills across multiple fields",
    "Trust & Transparency:Ratings, reviews, and exchange tracking ensure fair trades",
    "Community-Driven Growth:Build connections and expand your expertise through collaboration"
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gray-50 rounded-3xl mb-16 container mx-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <h2 className="text-gray-800 text-lg font-semibold mb-6">About Us</h2>
            <h1 className="text-3xl md:text-4xl font-medium text-gray-800 mb-8">
              <span className="text-primary">Empowering Growth </span> Through Skill Exchange
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
              Skill Swap is an AI-driven platform that enables people to exchange skills and services without money.
              It intelligently matches users based on their expertise and needs, ensuring seamless and fair exchanges.
              Join a collaborative community where your skills are your currency!
            </p>
          </div>
          <div className="md:w-1/2">
            <img src={heroimg} alt="People collaborating" width={600} height={600} className=" rounded-3xl h-96 w-full" />
          </div>
        </div>
      </section>


      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-24 mx-auto container">
        <div className="p-8 rounded-3xl border">
          <img src={rocket} alt="rocket" className="bg-white w-32 h-32 mx-auto mb-8 rounded-2xl" />
          <h3 className="text-primary text-2xl text-center font-medium mb-4">Mission</h3>
          <p className="text-gray-600 text-center">
            To empower individuals and communities by enabling skill exchange without financial barriers.
          </p>
        </div>

        <div className="p-8 rounded-3xl border">
          <img src={sunrise} alt="sunrise" className="bg-white w-32 h-32 mx-auto mb-8 rounded-2xl" />
          <h3 className="text-primary text-2xl text-center font-medium mb-4">Vision</h3>
          <p className="text-gray-600 text-center">
            To provide an AI-driven platform that facilitates seamless, fair, and transparent skill-sharing experiences.
          </p>
        </div>
      </div>

      {/* Features */}
      <section className="mb-24 mx-auto container">
        <h2 className="text-3xl font-medium text-gray-800 mb-8">Why Choose Skill Swap?</h2>
        <ul className="flex flex-col gap-6 list-disc pl-5">
          {features.map((feature, index) => (
            <li key={index} className="text-gray-600 mb-4">{feature.split(`:`).map((item, index) => {
              if (index === 0) return <span className="font-bold">{item}- </span>
              return <span>{item}</span>
            })}</li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default About;
