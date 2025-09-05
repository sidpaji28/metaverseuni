import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Star, Flame, Target, Users, Calendar } from "lucide-react";

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

interface UserAchievement {
  achievement_id: string;
  achievements: Achievement;
}

const DynamicGamifiedLearning = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<Profile[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      fetchPublicData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const [profileData, achievementsData, userAchievementsData, leaderboardData, challengesData] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("achievements").select("*").order("points_required"),
        supabase.from("user_achievements").select("*, achievements(*)").eq("user_id", user.id),
        supabase.from("profiles").select("*").order("points", { ascending: false }).limit(10),
        supabase.from("challenges").select("*").eq("is_active", true).order("end_date").limit(3)
      ]);

      if (profileData.data) setUserProfile(profileData.data);
      if (achievementsData.data) setAchievements(achievementsData.data);
      if (userAchievementsData.data) setUserAchievements(userAchievementsData.data);
      if (leaderboardData.data) setLeaderboard(leaderboardData.data);
      if (challengesData.data) setChallenges(challengesData.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicData = async () => {
    try {
      const [leaderboardData, challengesData, achievementsData] = await Promise.all([
        supabase.from("profiles").select("*").order("points", { ascending: false }).limit(7),
        supabase.from("challenges").select("*").eq("is_active", true).order("end_date").limit(3),
        supabase.from("achievements").select("*").order("points_required").limit(6)
      ]);

      if (leaderboardData.data) setLeaderboard(leaderboardData.data);
      if (challengesData.data) setChallenges(challengesData.data);
      if (achievementsData.data) setAchievements(achievementsData.data);
    } catch (error) {
      console.error("Error fetching public data:", error);
    } finally {
      setLoading(false);
    }
  };

  const joinChallenge = async (challengeId: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to join challenges.",
        variant: "destructive",
      });
      return;
    }

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

  const userRank = userProfile ? leaderboard.findIndex(p => p.user_id === userProfile.user_id) + 1 : null;
  const earnedAchievementIds = userAchievements.map(ua => ua.achievement_id);

  if (loading) {
    return (
      <section id="gamified" className="py-20 relative bg-gradient-to-br from-cosmic to-nebula">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-primary mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="gamified" className="py-20 relative bg-gradient-to-br from-cosmic to-nebula">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Gamified Learning
            <br />
            <span className="bg-aurora bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Level up your education with points, badges, and competitive challenges that make learning addictive.
          </p>
        </div>

        {/* User Stats - Only show if logged in */}
        {user && userProfile && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-card/80 backdrop-blur-md border-neon/20 text-center">
              <CardContent className="pt-6">
                <Trophy className="w-8 h-8 text-neon-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-neon-primary">{userProfile.points}</div>
                <p className="text-sm text-muted-foreground">Points</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-md border-neon/20 text-center">
              <CardContent className="pt-6">
                <Star className="w-8 h-8 text-neon-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-neon-primary">{userProfile.level}</div>
                <p className="text-sm text-muted-foreground">Level</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-md border-neon/20 text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-neon-primary">#{userRank || "N/A"}</div>
                <p className="text-sm text-muted-foreground">Global Rank</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-md border-neon/20 text-center">
              <CardContent className="pt-6">
                <Flame className="w-8 h-8 text-neon-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-neon-primary">{userProfile.current_streak}</div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {/* Achievements */}
          <Card className="bg-card/80 backdrop-blur-md border-neon/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-neon-primary" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {achievements.slice(0, 6).map((achievement) => {
                  const isEarned = earnedAchievementIds.includes(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        isEarned
                          ? "border-neon bg-neon/10 glow-soft"
                          : "border-muted bg-muted/20 opacity-60"
                      }`}
                    >
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <h4 className="text-sm font-medium mb-1">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Global Leaderboard */}
          <Card className="bg-card/80 backdrop-blur-md border-neon/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-neon-primary" />
                Global Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-2 rounded ${
                      user && player.user_id === user.id
                        ? "bg-primary/20 border border-primary/50"
                        : "hover:bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-neon-primary">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-sm">{player.display_name || player.username}</p>
                        <p className="text-xs text-muted-foreground">Level {player.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-neon-primary text-sm">{player.points}</p>
                      <p className="text-xs text-muted-foreground">{player.current_streak}🔥</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Challenges */}
          <Card className="bg-card/80 backdrop-blur-md border-neon/20 lg:col-span-2 xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-neon-primary" />
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="p-3 border border-neon/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{challenge.title}</h4>
                      <Badge 
                        variant={challenge.difficulty === "hard" ? "destructive" : 
                                challenge.difficulty === "medium" ? "default" : "secondary"}
                      >
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{challenge.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-neon-primary font-medium">{challenge.points_reward}</span> points
                        <br />
                        <span className="text-muted-foreground">
                          Ends: {new Date(challenge.end_date).toLocaleDateString()}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => joinChallenge(challenge.id)}
                        disabled={!user}
                      >
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-card/80 backdrop-blur-md border-neon/20 max-w-md mx-auto">
            <CardContent className="pt-6">
              <Trophy className="w-12 h-12 text-neon-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Ready to Level Up?</h3>
              <p className="text-muted-foreground mb-4">
                {user 
                  ? "Continue your learning journey and climb the leaderboard!"
                  : "Join thousands of students in the ultimate learning adventure!"
                }
              </p>
              <Button 
                className="bg-primary text-primary-foreground glow-primary hover:glow-secondary"
                onClick={() => window.location.href = user ? "/dashboard" : "/auth"}
              >
                {user ? "Go to Dashboard" : "Start Learning Now"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DynamicGamifiedLearning;