import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Code, 
  Server, 
  Table, 
  Trophy, 
  Clock, 
  Star, 
  BookOpen,
  TrendingUp
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
    enabled: isAuthenticated,
  });

  const { data: progress } = useQuery({
    queryKey: ["/api/progress"],
    enabled: isAuthenticated,
  });

  const { data: certificates } = useQuery({
    queryKey: ["/api/certificates"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  const userName = user?.firstName || user?.email?.split('@')[0] || 'Student';
  const userXP = user?.xp || 1250;
  const userLevel = user?.level || 8;
  const streakDays = user?.streakDays || 7;

  // Mock data for demonstration
  const stats = {
    coursesCompleted: certificates?.length || 5,
    hoursLearned: 47,
    certificatesEarned: certificates?.length || 5,
  };

  const learningTracks = [
    {
      id: 'programming',
      title: 'Programming Languages',
      description: 'Master the top 10 programming languages with interactive coding challenges and real-world projects.',
      icon: Code,
      color: 'primary',
      progress: 65,
      completedSkills: ['Python ✓', 'JavaScript ✓'],
      currentSkill: 'Java',
      totalSkills: 10,
      link: '/course/python/lessons'
    },
    {
      id: 'devops',
      title: 'DevOps Engineering',
      description: 'Learn CI/CD, containerization, and infrastructure automation with practical exercises.',
      icon: Server,
      color: 'green',
      progress: 32,
      completedSkills: ['Git ✓'],
      currentSkill: 'Docker',
      totalSkills: 8,
      link: '/courses/devops'
    },
    {
      id: 'architecture',
      title: 'Solutions Architecture',
      description: 'Design scalable systems with cloud platforms, microservices, and system design principles.',
      icon: Table,
      color: 'purple',
      progress: 18,
      completedSkills: [],
      currentSkill: 'AWS Basics',
      totalSkills: 7,
      link: '/courses/architecture'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}!
          </h2>
          <p className="text-gray-600">Continue your learning journey and master the skills that matter.</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.coursesCompleted}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Courses Completed</h3>
              <p className="text-sm text-gray-600">+2 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.certificatesEarned}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Certificates Earned</h3>
              <p className="text-sm text-gray-600">Latest: Python Basics</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.hoursLearned}h</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Hours Learned</h3>
              <p className="text-sm text-gray-600">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Level {userLevel}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Current Level</h3>
              <p className="text-sm text-gray-600">230 XP to next level</p>
            </CardContent>
          </Card>
        </div>

        {/* Learning Tracks */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Choose Your Learning Path</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {learningTracks.map((track) => {
              const IconComponent = track.icon;
              return (
                <Card key={track.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 bg-${track.color === 'primary' ? 'primary' : track.color === 'green' ? 'green-600' : 'purple-600'}/10 rounded-xl flex items-center justify-center`}>
                        <IconComponent className={`w-8 h-8 text-${track.color === 'primary' ? 'primary' : track.color === 'green' ? 'green-600' : 'purple-600'}`} />
                      </div>
                      <Badge variant="secondary">{track.totalSkills} Skills</Badge>
                    </div>
                    <CardTitle className="text-lg">{track.title}</CardTitle>
                    <CardDescription className="text-sm">{track.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{track.progress}%</span>
                      </div>
                      <Progress value={track.progress} className="h-2" />
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {track.completedSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {track.currentSkill && (
                        <Badge variant="outline" className="text-xs">
                          {track.currentSkill}
                        </Badge>
                      )}
                      {track.totalSkills > track.completedSkills.length + 1 && (
                        <Badge variant="outline" className="text-xs text-gray-500">
                          +{track.totalSkills - track.completedSkills.length - 1} more
                        </Badge>
                      )}
                    </div>
                    <Link href={track.link}>
                      <Button className="w-full">
                        {track.progress > 0 ? 'Continue Learning' : 'Get Started'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Job Market Insights
              </CardTitle>
              <CardDescription>
                Stay updated with the latest trends in tech hiring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Python</span>
                  <span className="text-sm text-green-600">+15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">JavaScript</span>
                  <span className="text-sm text-green-600">+12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">AWS</span>
                  <span className="text-sm text-green-600">+18%</span>
                </div>
              </div>
              <Link href="/job-insights">
                <Button variant="outline" className="w-full mt-4">
                  View Full Report
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>
                Pick up where you left off
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-sm">Python Fundamentals</h4>
                  <p className="text-xs text-gray-600">Chapter 3: Functions and Control Flow</p>
                  <Progress value={45} className="h-2 mt-2" />
                </div>
                <Link href="/course/python">
                  <Button className="w-full">
                    Resume Course
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
