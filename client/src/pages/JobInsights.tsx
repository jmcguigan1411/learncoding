import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Star,
  Briefcase,
  Target
} from "lucide-react";

export default function JobInsights() {
  const { isAuthenticated, isLoading } = useAuth();
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

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  const topSkills = [
    {
      rank: 1,
      name: "Python",
      category: "Backend Development, AI/ML",
      growth: "+15%",
      color: "primary"
    },
    {
      rank: 2,
      name: "JavaScript",
      category: "Full-stack Development",
      growth: "+12%",
      color: "primary"
    },
    {
      rank: 3,
      name: "AWS",
      category: "Cloud Infrastructure",
      growth: "+18%",
      color: "primary"
    },
    {
      rank: 4,
      name: "Docker",
      category: "DevOps, Containerization",
      growth: "+22%",
      color: "primary"
    },
    {
      rank: 5,
      name: "React",
      category: "Frontend Development",
      growth: "+9%",
      color: "primary"
    }
  ];

  const trendingRoles = [
    {
      title: "AI/ML Engineer",
      salary: "$120K - $180K",
      growth: "+34%",
      color: "green"
    },
    {
      title: "DevOps Engineer",
      salary: "$95K - $140K",
      growth: "+28%",
      color: "green"
    },
    {
      title: "Cloud Architect",
      salary: "$130K - $200K",
      growth: "+25%",
      color: "green"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Job Market Insights</h2>
          <p className="text-gray-600">Stay ahead with the latest trends in tech hiring and skill demands.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Market Growth</h3>
                  <p className="text-2xl font-bold text-green-600">+23%</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Tech job openings increased this quarter</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Avg. Salary</h3>
                  <p className="text-2xl font-bold text-blue-600">$95K</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">For mid-level software engineers</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Time to Hire</h3>
                  <p className="text-2xl font-bold text-purple-600">28 days</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Average hiring process duration</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Skills in Demand */}
          <Card>
            <CardHeader>
              <CardTitle>Most In-Demand Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSkills.map((skill) => (
                  <div key={skill.rank} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">{skill.rank}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                        <p className="text-sm text-gray-600">{skill.category}</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-semibold">{skill.growth}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Career Recommendations */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Personalized Career Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Recommended Role</h4>
                  <p className="text-lg font-bold text-primary">Full-Stack Developer</p>
                  <p className="text-sm text-gray-600 mt-1">Based on your Python and JavaScript progress</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Skills Match</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={78} className="w-16 h-2" />
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Missing skills:</strong> Node.js, MongoDB, React Advanced
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Trending Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingRoles.map((role, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900">{role.title}</h4>
                        <p className="text-sm text-gray-600">{role.salary}</p>
                      </div>
                      <Badge variant="secondary" className="text-green-600 bg-green-100">
                        {role.growth}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skills Gap Analysis */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Skills Gap Analysis</CardTitle>
            <CardDescription>
              Based on your current progress and market demands
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">High Priority</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Node.js</span>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Docker</span>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Medium Priority</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">MongoDB</span>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">Important</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AWS Lambda</span>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">Important</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Low Priority</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">GraphQL</span>
                    <Badge variant="secondary">Nice to have</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kubernetes</span>
                    <Badge variant="secondary">Nice to have</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Ready to Close the Gap?</CardTitle>
              <CardDescription>
                Start learning the skills that employers are looking for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <button className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Browse Courses
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
