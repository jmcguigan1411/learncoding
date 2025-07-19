import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Code, 
  Flame, 
  Star, 
  User, 
  LogOut,
  Menu,
  BookOpen,
  TrendingUp,
  Award
} from "lucide-react";

export default function Navigation() {
  const { user } = useAuth();

  const userXP = user?.xp || 1250;
  const streakDays = user?.streakDays || 7;
  const userInitials = user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">CodeMaster Academy</h1>
              </div>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/">
                <a className="text-primary font-medium border-b-2 border-primary pb-4">
                  Dashboard
                </a>
              </Link>
              <a href="#courses" className="text-gray-600 hover:text-gray-900 pb-4">
                My Courses
              </a>
              <Link href="/job-insights">
                <a className="text-gray-600 hover:text-gray-900 pb-4">
                  Job Insights
                </a>
              </Link>
              <a href="#achievements" className="text-gray-600 hover:text-gray-900 pb-4">
                Achievements
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Streak */}
            <div className="hidden md:flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">{streakDays} day streak</span>
            </div>
            
            {/* XP */}
            <div className="hidden md:flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-lg">
              <Star className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">{userXP.toLocaleString()} XP</span>
            </div>
            
            {/* Mobile Menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>My Courses</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/job-insights">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Job Insights</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4" />
                      <span>Achievements</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-8 h-8 rounded-full p-0">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-medium text-sm">{userInitials}</span>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>Certificates</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                  <div className="flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
