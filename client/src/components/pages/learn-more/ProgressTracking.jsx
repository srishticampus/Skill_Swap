import React from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProgressTracking() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Button variant="link" asChild className="mb-8 p-0">
        <Link to="/" className="flex items-center text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
      </Button>
      <h1 className="text-4xl font-bold text-foreground mb-6">Track Your Skill Exchange Progress</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Our comprehensive progress tracking system allows you to monitor your learning journey, celebrate milestones, and visualize your growth over time. Stay motivated and see the tangible results of your skill exchanges.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold text-primary mb-4">How We Help You Track</h2>
          <ul className="list-disc list-inside space-y-3 text-muted-foreground">
            <li><strong>Dashboard Overview:</strong> A personalized dashboard provides a quick glance at your active, pending, and completed skill swaps.</li>
            <li><strong>Milestone Tracking:</strong> Set and track personal learning milestones for each skill you're acquiring or teaching.</li>
            <li><strong>Feedback and Ratings:</strong> After each exchange, provide and receive feedback, contributing to your overall progress and reputation.</li>
            <li><strong>Visual Progress Reports:</strong> See your skill development through intuitive charts and graphs that highlight your growth areas.</li>
          </ul>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold text-primary mb-4">Benefits for Your Growth</h2>
          <ul className="list-disc list-inside space-y-3 text-muted-foreground">
            <li><strong>Stay Motivated:</strong> Visualize your progress and celebrate every step of your learning journey.</li>
            <li><strong>Identify Strengths & Weaknesses:</strong> Understand where you've excelled and areas that need more focus.</li>
            <li><strong>Build a Strong Portfolio:</strong> Document your completed exchanges and acquired skills for future reference.</li>
            <li><strong>Continuous Improvement:</strong> Use feedback to refine your teaching and learning approaches.</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xl text-foreground mb-4">Ready to visualize your skill growth?</p>
        <Button asChild>
          <Link to="/signup">Start Tracking Now</Link>
        </Button>
      </div>
    </div>
  );
}
