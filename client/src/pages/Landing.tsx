import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Server, Table, TrendingUp, Users, Award } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">CodeMaster Academy</h1>
            </div>
            <Button onClick={() => window.location.href = '/api/login'}>
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Master the Skills That
            <span className="text-primary"> Matter</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Learn programming, master DevOps, and design scalable architectures with our 
            interactive platform. Stay ahead in the rapidly evolving tech landscape.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-3"
            onClick={() => window.location.href = '/api/login'}
          >
            Start Learning Free
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Code className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Programming Languages</CardTitle>
              <CardDescription>
                Master the top 10 programming languages with interactive coding challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Python</span>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">JavaScript</span>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Java</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">+7 more</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Server className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>DevOps Engineering</CardTitle>
              <CardDescription>
                Learn CI/CD, containerization, and infrastructure automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Docker</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Kubernetes</span>
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Jenkins</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">+5 more</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Table className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle>Solutions Architecture</CardTitle>
              <CardDescription>
                Design scalable systems with cloud platforms and microservices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">AWS</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Azure</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">GCP</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">+4 more</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900">10K+</div>
            <div className="text-gray-600">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Code className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">100+</div>
            <div className="text-gray-600">Interactive Lessons</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">5K+</div>
            <div className="text-gray-600">Certificates Issued</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Start Your Journey?</CardTitle>
              <CardDescription>
                Join thousands of learners who are already advancing their careers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => window.location.href = '/api/login'}
              >
                Get Started Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
