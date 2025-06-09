import React from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AISkillMatching() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Button variant="link" asChild className="mb-8 p-0">
        <Link to="/" className="flex items-center text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
      </Button>
      <h1 className="text-4xl font-bold text-foreground mb-6">AI-Powered Skill Matching</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Our advanced AI system revolutionizes the way you find skill exchange partners. By leveraging cutting-edge machine learning algorithms, we ensure you connect with individuals whose skills perfectly complement your learning goals and offerings.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold text-primary mb-4">How it Works</h2>
          <ul className="list-disc list-inside space-y-3 text-muted-foreground">
            <li><strong>Smart Resume Analysis:</strong> Upload your resume, and our AI automatically extracts and categorizes your technical and soft skills, experience levels, and interests.</li>
            <li><strong>Personalized Skill Graph:</strong> We build a dynamic skill graph for each user, mapping your proficiencies and areas for growth.</li>
            <li><strong>Intelligent Matching Algorithm:</strong> Our algorithm analyzes skill gaps and overlaps across our user base to suggest the most relevant and beneficial exchange partners.</li>
            <li><strong>Continuous Learning:</strong> The AI learns from successful exchanges and user feedback, constantly refining its matching accuracy to provide even better recommendations over time.</li>
          </ul>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold text-primary mb-4">Benefits for You</h2>
          <ul className="list-disc list-inside space-y-3 text-muted-foreground">
            <li><strong>Save Time:</strong> No more endless searching. Get precise matches instantly.</li>
            <li><strong>Maximize Learning:</strong> Connect with experts in the exact skills you want to acquire.</li>
            <li><strong>Expand Your Network:</strong> Discover like-minded professionals and build valuable connections.</li>
            <li><strong>Efficient Exchanges:</strong> Our smart matching leads to more productive and successful skill swaps.</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xl text-foreground mb-4">Ready to find your perfect skill exchange partner?</p>
        <Button asChild>
          <Link to="/signup">Get Started Today</Link>
        </Button>
      </div>
    </div>
  );
}
