import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MapPin, Phone, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router';
import axios from '@/api/axios'; // Import axios

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null); // Create a ref for the search input
  const inputWasFocusedRef = useRef(false); // Ref to track if the input was focused before fetch

  const fetchMembers = async () => {
    // Capture focus state before the async operation
    inputWasFocusedRef.current = searchInputRef.current === document.activeElement;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/organizations/members', {
        params: { search: searchQuery },
      });
      setMembers(response.data);
    } catch (err) {
      setError(err);
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
      // Focus restoration will be handled by a separate useEffect
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMembers();
    }, 500); // Delay API call by 500ms

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout on unmount or searchQuery change
  }, [searchQuery]); // Refetch when searchQuery changes

  // Effect to restore focus after loading is complete
  useEffect(() => {
    if (!loading && inputWasFocusedRef.current && searchInputRef.current) {
      searchInputRef.current.focus();
      // Reset the ref after restoring focus
      inputWasFocusedRef.current = false;
    }
  }, [loading]); // Trigger this effect when loading state changes

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleActivateDeactivate = async (memberId, isActive) => {
    try {
      const endpoint = isActive ? `/api/organizations/members/${memberId}/activate` : `/api/organizations/members/${memberId}/deactivate`;
      await axios.put(endpoint);
      // Update the member's status in the local state
      setMembers(members.map(member =>
        member._id === memberId ? { ...member, isActive: isActive } : member
      ));
    } catch (err) {
      console.error(`Error ${isActive ? 'activating' : 'deactivating'} member:`, err);
      // Optionally show an error message to the user
    }
  };


  if (loading) {
    return (
      <div className="container mx-auto p-6 text-white min-h-screen">
        <Skeleton className="h-8 w-1/3 mb-8 mx-auto" /> {/* For "View Member" title */}
        <div className="flex justify-center mb-8">
          <Skeleton className="h-10 w-full max-w-md rounded-full" /> {/* For search input */}
          <Skeleton className="h-10 w-36 ml-4 rounded-md" /> {/* For "Add New Member" button */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="bg-white border-gray-200 rounded-lg overflow-hidden">
              <CardContent className="p-6 flex items-center">
                <Skeleton className="w-24 h-24 rounded-full mr-6" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-1" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <Skeleton className="h-5 w-1/4 mb-4" />
                  <div className="flex space-x-4 mb-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                  <Skeleton className="h-4 w-1/4 ml-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-6 text-white min-h-screen">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-6 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">View Member</h1>

      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
          <Input
            type="text"
            placeholder="Search here..."
            className="pl-10 pr-4 py-2 rounded-full bg-white text-foreground border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary w-full"
            value={searchQuery}
            onChange={handleSearchInputChange}
            ref={searchInputRef} // Attach the ref to the input element
          />
        </div>
        <Link to="/organization/members/add" className="ml-4">
          <Button >
            Add New Member
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {members.map((member) => (
          <Card key={member._id} className="bg-white border-gray-200 rounded-lg overflow-hidden">
            <CardContent className="p-6 flex items-center">
              <Avatar className="w-24 h-24 mr-6">
                <AvatarImage src={`${import.meta.env.VITE_API_URL}/${profileData.profilePictureUrl}`} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h2 className="text-xl font-semibold mr-2 border-r-1 border-gray-400 pr-2">{member.name}</h2>
                  <Separator orientation='vertical' className="h-full" />
                  <span className="text-sm text-gray-600">{member.gender}</span>
                </div>
                <p className="text-primary mb-2">{member.email}</p>
                <Separator orientation='horizontal' className="mb-2" />

                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <MapPin size={16} className="mr-1" />
                  <span>{`${member.city}, ${member.country}`}</span> {/* Use city and country from API */}
                </div>
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <Phone size={16} className="mr-1" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center mb-4">
                  <span className="text-sm text-gray-600 mr-2">Total Request Handled</span>
                  <Badge className="bg-primary text-white rounded-full px-3 py-1 text-xs">{member.requestsHandled || 'N/A'}</Badge> {/* requestsHandled might not be in User model, use default */}
                </div>
                <div className="flex space-x-4 mb-4">
                  <Button
                    variant={member.isActive ? "outline" : "default"} // Change variant based on isActive
                    className="flex-1"
                    onClick={() => handleActivateDeactivate(member._id, true)}
                    disabled={member.isActive} // Disable if already active
                  >
                    Active
                  </Button>
                  <Button
                    variant={member.isActive ? "default" : "outline"} // Change variant based on isActive
                    className="flex-1 "
                    onClick={() => handleActivateDeactivate(member._id, false)}
                    disabled={!member.isActive} // Disable if already inactive
                  >
                    Deactive
                  </Button>
                </div>
                <div className="text-right">
                  <Link to={`/organization/members/details/${member._id}`} className="text-primary hover:underline flex items-center justify-end"> {/* Corrected path */}
                    View More <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Members;
