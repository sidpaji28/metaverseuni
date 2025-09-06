import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Trophy, Star, TrendingUp, Calendar, BookOpen, Target } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  points: number;
  level: number;
  current_streak: number;
  longest_streak: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  points_reward: number;
  difficulty: string;
  end_date: string;
}

interface Class {
  id: string;
  name: string;
  description: string;
  subject: string;
  instructor: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [leaderboard, setLeaderboard] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    await Promise.all([
      fetchProfile(session.user.id),
      fetchAchievements(),
      fetchChallenges(),
      fetchClasses(),
      fetchLeaderboard()
    ]);
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setProfile(data);
    }
  };

  const fetchAchievements = async () => {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("points_required");

    if (error) {
      console.error("Error fetching achievements:", error);
    } else {
      setAchievements(data || []);
    }
  };

  const fetchChallenges = async () => {
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("is_active", true)
      .order("end_date");

    if (error) {
      console.error("Error fetching challenges:", error);
    } else {
      setChallenges(data || []);
    }
  };

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error fetching classes:", error);
    } else {
      setClasses(data || []);
    }
  };

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("points", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching leaderboard:", error);
    } else {
      setLeaderboard(data || []);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const joinChallenge = async (challengeId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("user_challenges")
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Challenge Joined!",
        description: "Good luck with your challenge!",
      });
    }
  };

  const enrollInClass = async (classId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("user_classes")
      .insert({
        user_id: user.id,
        class_id: classId,
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Enrolled!",
        description: "You've been enrolled in the class!",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic">
      <header className="border-b border-neon bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-aurora rounded-full animate-pulse-glow"></div>
            <h1 className="text-xl font-bold text-neon-primary">Metaverse University</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-foreground">Welcome, {profile?.display_name || "Student"}</span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/80 backdrop-blur-md border-neon/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-neon-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-primary">{profile?.points || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-md border-neon/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Star className="h-4 w-4 text-neon-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-primary">{profile?.level || 1}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-md border-neon/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-neon-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-primary">{profile?.current_streak || 0} days</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-md border-neon/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rank</CardTitle>
              <Trophy className="h-4 w-4 text-neon-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-primary">
                #{leaderboard.findIndex(p => p.user_id === user?.id) + 1 || "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur-md border-neon/20">
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <p className="font-medium">{achievement.name}</p>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-md border-neon/20">
                <CardHeader>
                  <CardTitle>Active Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {challenges.slice(0, 3).map((challenge) => (
                      <div key={challenge.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{challenge.title}</h4>
                          <Badge variant="secondary">{challenge.difficulty}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Reward: {challenge.points_reward} points</span>
                          <Button size="sm" onClick={() => joinChallenge(challenge.id)}>
                            Join
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <Card className="bg-card/80 backdrop-blur-md border-neon/20">
              <CardHeader>
                <CardTitle>All Achievements</CardTitle>
                <CardDescription>Unlock achievements to earn points and recognition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="p-4 border border-neon/20 rounded-lg">
                      <div className="text-center space-y-2">
                        <span className="text-4xl">{achievement.icon}</span>
                        <h3 className="font-medium">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges">
            <Card className="bg-card/80 backdrop-blur-md border-neon/20">
              <CardHeader>
                <CardTitle>Active Challenges</CardTitle>
                <CardDescription>Join challenges to earn extra points and compete with others</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="p-4 border border-neon/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{challenge.title}</h3>
                        <Badge variant="secondary">{challenge.difficulty}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{challenge.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm">Reward: {challenge.points_reward} points</span>
                          <span className="text-sm">Ends: {new Date(challenge.end_date).toLocaleDateString()}</span>
                        </div>
                        <Button onClick={() => joinChallenge(challenge.id)}>
                          Join Challenge
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes">
            <Card className="bg-card/80 backdrop-blur-md border-neon/20">
              <CardHeader>
                <CardTitle>Available Classes</CardTitle>
                <CardDescription>Enroll in classes to expand your knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classes.map((classItem) => (
                    <div key={classItem.id} className="p-4 border border-neon/20 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{classItem.name}</h3>
                          <Badge variant="outline">{classItem.subject}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{classItem.description}</p>
                        <p className="text-sm">Instructor: {classItem.instructor}</p>
                        <Button 
                          className="w-full" 
                          onClick={() => enrollInClass(classItem.id)}
                        >
                          Enroll
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="bg-card/80 backdrop-blur-md border-neon/20">
              <CardHeader>
                <CardTitle>Global Leaderboard</CardTitle>
                <CardDescription>See how you rank against other students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((student, index) => (
                    <div 
                      key={student.id} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        student.user_id === user?.id ? 'bg-primary/20 border border-primary/50' : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-lg">#{index + 1}</span>
                        <div>
                          <p className="font-medium">{student.display_name || student.username}</p>
                          <p className="text-sm text-muted-foreground">Level {student.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-neon-primary">{student.points} pts</p>
                        <p className="text-sm text-muted-foreground">{student.current_streak} day streak</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;