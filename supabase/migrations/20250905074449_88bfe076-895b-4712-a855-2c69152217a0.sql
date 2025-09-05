-- Create profiles table for student data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points_required INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'general', -- 'streak', 'points', 'challenge', 'general'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table (many-to-many)
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create challenges table
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points_reward INTEGER NOT NULL DEFAULT 100,
  difficulty TEXT NOT NULL DEFAULT 'medium', -- 'easy', 'medium', 'hard'
  duration_days INTEGER NOT NULL DEFAULT 7,
  max_participants INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_challenges table (many-to-many)
CREATE TABLE public.user_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress INTEGER NOT NULL DEFAULT 0, -- percentage 0-100
  UNIQUE(user_id, challenge_id)
);

-- Create classes table
CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  instructor TEXT,
  schedule_time TIME,
  schedule_days TEXT[], -- ['monday', 'wednesday', 'friday']
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_classes table (many-to-many)
CREATE TABLE public.user_classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, class_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_classes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles for leaderboard" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for achievements
CREATE POLICY "Everyone can view achievements" 
ON public.achievements 
FOR SELECT 
USING (true);

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for challenges
CREATE POLICY "Everyone can view active challenges" 
ON public.challenges 
FOR SELECT 
USING (is_active = true);

-- Create RLS policies for user_challenges
CREATE POLICY "Users can view their own challenge progress" 
ON public.user_challenges 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can join challenges" 
ON public.user_challenges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenge progress" 
ON public.user_challenges 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for classes
CREATE POLICY "Everyone can view active classes" 
ON public.classes 
FOR SELECT 
USING (is_active = true);

-- Create RLS policies for user_classes
CREATE POLICY "Users can view their own classes" 
ON public.user_classes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in classes" 
ON public.user_classes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample achievements
INSERT INTO public.achievements (name, description, icon, points_required, type) VALUES
('First Login', 'Welcome to Metaverse University!', '🌟', 0, 'general'),
('Point Collector', 'Earn your first 100 points', '💎', 100, 'points'),
('Streak Starter', 'Maintain a 3-day learning streak', '🔥', 0, 'streak'),
('Challenge Champion', 'Complete your first challenge', '🏆', 0, 'challenge'),
('Knowledge Seeker', 'Earn 500 points', '📚', 500, 'points'),
('Consistent Learner', 'Maintain a 7-day streak', '⭐', 0, 'streak'),
('Master Student', 'Earn 1000 points', '👑', 1000, 'points');

-- Insert some sample challenges
INSERT INTO public.challenges (title, description, points_reward, difficulty, duration_days, end_date) VALUES
('Math Marathon', 'Complete 50 math problems this week', 150, 'medium', 7, now() + interval '7 days'),
('Science Explorer', 'Finish 3 science modules', 200, 'hard', 10, now() + interval '10 days'),
('Reading Sprint', 'Read for 30 minutes daily', 100, 'easy', 5, now() + interval '5 days'),
('Quiz Master', 'Score 90% or higher on 5 quizzes', 250, 'hard', 14, now() + interval '14 days');

-- Insert some sample classes
INSERT INTO public.classes (name, description, subject, instructor, schedule_time, schedule_days) VALUES
('Advanced Mathematics', 'Calculus and beyond', 'Mathematics', 'Dr. Smith', '09:00:00', ARRAY['monday', 'wednesday', 'friday']),
('Physics Fundamentals', 'Introduction to Physics', 'Physics', 'Prof. Johnson', '14:00:00', ARRAY['tuesday', 'thursday']),
('Literature Analysis', 'Classic and modern literature', 'English', 'Ms. Davis', '11:00:00', ARRAY['monday', 'wednesday']),
('Chemistry Lab', 'Hands-on chemistry experiments', 'Chemistry', 'Dr. Wilson', '15:30:00', ARRAY['tuesday', 'friday']);