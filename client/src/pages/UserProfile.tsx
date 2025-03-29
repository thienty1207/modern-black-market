import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Navigate, Link } from 'react-router-dom';
import { useUser, useClerk, SignedIn, SignedOut } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';
import { User, Shield, Plus, Phone, LogOut, ChevronRight, Edit3, X } from 'lucide-react';

const UserProfile = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (!isLoaded) {
    return <div className="pt-32 pb-20 px-4 md:px-8 flex justify-center">Đang tải...</div>;
  }

  const handleUpdateProfile = () => {
    // Thực hiện cập nhật thông tin hồ sơ
    setIsEditingProfile(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            {isEditingProfile ? (
              <div className="rounded-lg bg-black/60 backdrop-blur-sm border border-purple-500/30 shadow-lg p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    Update profile
                  </h2>
                  
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 relative rounded-full overflow-hidden mb-3 flex items-center justify-center bg-purple-600/50 border-2 border-purple-500/50">
                      {user?.imageUrl ? (
                        <img 
                          src={user.imageUrl} 
                          alt={user.fullName || ''}
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-2xl font-semibold text-white">
                          {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs bg-black/30 hover:bg-purple-900/30 border-purple-500/40 text-white"
                      >
                        Upload
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs border-red-500/40 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                      >
                        Remove
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Recommended size 1:1, up to 10MB.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm text-gray-300">First name</Label>
                      <Input 
                        id="firstName" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-black/50 border-purple-500/30 focus:border-purple-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm text-gray-300">Last name</Label>
                      <Input 
                        id="lastName" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-black/50 border-purple-500/30 focus:border-purple-500 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 border-t border-purple-500/20 pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsEditingProfile(false)}
                    className="text-white/70 hover:text-white hover:bg-black/40"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdateProfile}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-none"
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-black/60 backdrop-blur-sm border border-purple-500/30 shadow-lg">
                <div className="p-6 border-b border-purple-500/20">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Profile</h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      Update profile
                    </Button>
                  </div>
                </div>
                
                <div className="p-6 flex items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center bg-purple-600/50 border-2 border-purple-500/50">
                    {user?.imageUrl ? (
                      <img 
                        src={user.imageUrl} 
                        alt={user.fullName || ''}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-xl font-semibold text-white">
                        {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{user?.fullName}</h3>
                  </div>
                </div>
              </div>
            )}
            
            <div className="rounded-lg bg-black/60 backdrop-blur-sm border border-purple-500/30 shadow-lg">
              <div className="p-6 border-b border-purple-500/20">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Email addresses</h2>
                  <div className="text-xs font-medium bg-purple-900/30 border border-purple-500/30 px-2 py-1 rounded text-purple-300">
                    Primary
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-white">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="mt-4 text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add email address
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg bg-black/60 backdrop-blur-sm border border-purple-500/30 shadow-lg">
              <div className="p-6 border-b border-purple-500/20">
                <h2 className="text-xl font-semibold text-white">Phone numbers</h2>
              </div>
              
              <div className="p-6">
                <Button 
                  variant="ghost" 
                  className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add phone number
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg bg-black/60 backdrop-blur-sm border border-purple-500/30 shadow-lg">
              <div className="p-6 border-b border-purple-500/20">
                <h2 className="text-xl font-semibold text-white">Connected accounts</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {user?.externalAccounts.map((account) => (
                    <div key={account.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-3 flex items-center justify-center bg-gray-800">
                          {account.provider === 'github' && (
                            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                              />
                            </svg>
                          )}
                          {account.provider === 'google' && (
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 326667 333333" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd">
                              <path d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38204 3428 342c31481-29074 49630-71852 49630-122468z" fill="#4285f4"/>
                              <path d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z" fill="#34a853"/>
                              <path d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851z" fill="#fbbc04"/>
                              <path d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 50927-69260 95001-69260z" fill="#ea4335"/>
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{account.provider.charAt(0).toUpperCase() + account.provider.slice(1)}</p>
                          <p className="text-sm text-gray-400">{account.username || account.email}</p>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="ghost" 
                  className="mt-4 text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Connect account
                </Button>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="rounded-lg bg-black/60 backdrop-blur-sm border border-purple-500/30 shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>
            <p className="text-gray-400 mb-6">Manage your account security and authentication methods.</p>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center py-3 border-b border-purple-500/20">
                <div>
                  <h3 className="font-medium text-white">Two-factor authentication</h3>
                  <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" className="bg-black/30 hover:bg-purple-900/30 border-purple-500/40 text-white">
                  Enable
                </Button>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-purple-500/20">
                <div>
                  <h3 className="font-medium text-white">Password settings</h3>
                  <p className="text-sm text-gray-400">Update your password or recovery methods</p>
                </div>
                <Button variant="outline" className="bg-black/30 hover:bg-purple-900/30 border-purple-500/40 text-white">
                  Manage
                </Button>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-purple-500/20">
                <div>
                  <h3 className="font-medium text-white">Recent devices</h3>
                  <p className="text-sm text-gray-400">View devices that recently signed into your account</p>
                </div>
                <Button variant="outline" className="bg-black/30 hover:bg-purple-900/30 border-purple-500/40 text-white">
                  View
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SignedIn>
        <motion.div 
          className="pt-32 pb-20 px-4 md:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gradient mb-4">
                Account
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Manage your account info.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-8">
              {/* Sidebar Navigation */}
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="rounded-lg bg-black/60 backdrop-blur-sm border border-purple-500/30 shadow-lg p-4">
                  <div className="space-y-1">
                    <button
                      className={cn(
                        "flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                        activeTab === 'profile'
                          ? "bg-purple-900/30 text-white"
                          : "text-gray-300 hover:text-white hover:bg-purple-900/20"
                      )}
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="h-4 w-4 mr-3 text-purple-400" />
                      Profile
                    </button>
                    <button
                      className={cn(
                        "flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                        activeTab === 'security'
                          ? "bg-purple-900/30 text-white"
                          : "text-gray-300 hover:text-white hover:bg-purple-900/20"
                      )}
                      onClick={() => setActiveTab('security')}
                    >
                      <Shield className="h-4 w-4 mr-3 text-purple-400" />
                      Security
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 text-center text-xs text-gray-500">
                  Secured by <span className="font-semibold">clerk</span>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {renderTabContent()}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  );
};

export default UserProfile;
