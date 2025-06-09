import React from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RealtimeChat() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Button variant="link" asChild className="mb-8 p-0">
        <Link to="/" className="flex items-center text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
      </Button>
      <h1 className="text-4xl font-bold text-foreground mb-6">Real-time Chat for Seamless Exchanges</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Our integrated real-time chat feature provides a direct and efficient way to communicate with your skill exchange partners. From initial introductions to finalizing exchange details, our chat ensures smooth and transparent interactions.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold text-primary mb-4">Key Features</h2>
          <ul className="list-disc list-inside space-y-3 text-muted-foreground">
            <li><strong>Instant Messaging:</strong> Send and receive messages in real-time, just like your favorite messaging apps.</li>
            <li><strong>Secure Communication:</strong> All conversations are private and secure, ensuring your discussions remain confidential.</li>
            <li><strong>Exchange-Specific Chats:</strong> Each skill exchange request gets its own dedicated chat, keeping conversations organized and focused.</li>
            <li><strong>Notification System:</strong> Stay updated with new messages through our integrated notification system, so you never miss an important update.</li>
          </ul>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold text-primary mb-4">Benefits for You</h2>
          <ul className="list-disc list-inside space-y-3 text-muted-foreground">
            <li><strong>Streamlined Communication:</strong> Discuss and finalize exchange details quickly and efficiently.</li>
            <li><strong>Clarity and Transparency:</strong> Keep all exchange-related discussions in one place for easy reference.</li>
            <li><strong>Build Rapport:</strong> Get to know your exchange partner better before committing to a swap.</li>
            <li><strong>Problem Resolution:</strong> Address any questions or concerns directly and in real-time.</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xl text-foreground mb-4">Ready to connect and collaborate?</p>
        <Button asChild>
          <Link to="/signup">Start Chatting Now</Link>
        </Button>
      </div>
    </div>
  );
}
