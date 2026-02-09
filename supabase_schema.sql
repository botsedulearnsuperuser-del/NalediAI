-- Tirelo Mental Health App Database Schema
-- This schema supports all app features including authentication, affirmations, daily checkups, wisdom, and more

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS & PROFILES
-- =============================================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    date_of_birth DATE,
    phone_number TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- AFFIRMATIONS
-- =============================================

CREATE TABLE IF NOT EXISTS public.user_affirmations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    affirmation_text TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_affirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own affirmations" ON public.user_affirmations
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- DAILY CHECKUPS
-- =============================================

CREATE TABLE IF NOT EXISTS public.daily_checkups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mood TEXT NOT NULL, -- 'great', 'good', 'okay', 'bad', 'terrible'
    emotions TEXT[], -- Array of emotion strings
    checkup_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.daily_checkups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own checkups" ON public.daily_checkups
    FOR ALL USING (auth.uid() = user_id);

-- Index for faster date queries
CREATE INDEX idx_daily_checkups_user_date ON public.daily_checkups(user_id, checkup_date DESC);

-- =============================================
-- WISDOM CONTENT
-- =============================================

CREATE TABLE IF NOT EXISTS public.wisdom_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wisdom_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.wisdom_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    how_to_perform TEXT,
    mastery_tip TEXT,
    action_steps TEXT,
    why_it_matters TEXT,
    quiz_question TEXT,
    quiz_options JSONB, -- Array of {id, text, correct}
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.wisdom_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wisdom_lessons ENABLE ROW LEVEL SECURITY;

-- Public read access for wisdom content
CREATE POLICY "Anyone can view wisdom categories" ON public.wisdom_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view wisdom lessons" ON public.wisdom_lessons
    FOR SELECT USING (is_active = true);

-- =============================================
-- USER PROGRESS & COMPLETION
-- =============================================

CREATE TABLE IF NOT EXISTS public.lesson_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.wisdom_lessons(id) ON DELETE CASCADE,
    quiz_answer TEXT,
    is_correct BOOLEAN,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own completions" ON public.lesson_completions
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- CHAT HISTORY
-- =============================================

CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat sessions" ON public.chat_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own chat messages" ON public.chat_messages
    FOR ALL USING (auth.uid() = user_id);

-- Index for faster message retrieval
CREATE INDEX idx_chat_messages_session ON public.chat_messages(session_id, created_at ASC);

-- =============================================
-- NOTIFICATIONS
-- =============================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- 'info', 'success', 'warning', 'reminder'
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read, created_at DESC);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affirmations_updated_at BEFORE UPDATE ON public.user_affirmations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- SEED DATA - Default Wisdom Content
-- =============================================

-- Insert default wisdom categories
INSERT INTO public.wisdom_categories (id, title, description, icon, color, position) VALUES
    ('a1111111-1111-1111-1111-111111111111', 'Positive Mindset', 'Techniques to cultivate positivity', 'sunny', '#A2C14D', 1),
    ('a2222222-2222-2222-2222-222222222222', 'Emotional Mastery', 'Master your emotions for greatness', 'heart-pulse', '#004b2c', 2),
    ('a3333333-3333-3333-3333-333333333333', 'Mental Resilience', 'Build unshakeable mental strength', 'shield-checkmark', '#FFD700', 3),
    ('a4444444-4444-4444-4444-444444444444', 'Daily Growth', 'Small steps to extraordinary transformation', 'trending-up', '#87CEEB', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert default wisdom lessons
INSERT INTO public.wisdom_lessons (
    id, category_id, title, content, icon, color,
    how_to_perform, mastery_tip, action_steps, why_it_matters,
    quiz_question, quiz_options, position
) VALUES
    (
        'b1111111-1111-1111-1111-111111111111',
        'a1111111-1111-1111-1111-111111111111',
        'Technique: Positive Anchoring',
        'Identify a moment of pure joy from your past. Close your eyes and relive it. As you feel the peak of the emotion, press your thumb and forefinger together. Repeat this to "anchor" the feeling.',
        'anchor',
        '#A2C14D',
        '1. Find a quiet space where you won''t be disturbed.
2. Breathe deeply for 5 seconds, filling your lungs with fresh energy.
3. Focus on the core feeling of the technique, visualizing its impact.
4. Apply it directly to a specific situation you encounter today.',
        'Don''t rush the process. True mentality shifts happen when you are consistently gentle with yourself. If your mind wanders, acknowledge it and refocus on the greatness you strive for.',
        '• Practice this 3 times today.
• Write down how you felt after applying it.
• Share this technique with someone else to solidify your own understanding.',
        'Mastering this technique helps brain plasticity and builds long-term mental resilience. By consistently practicing positive reframing, you are training your mind to strive for greatness.',
        'What is the most important aspect of mastering this technique?',
        '[
            {"id": "a", "text": "Doing it perfectly the first time", "correct": false},
            {"id": "b", "text": "Being consistently gentle with yourself", "correct": true},
            {"id": "c", "text": "Rushing through the steps", "correct": false},
            {"id": "d", "text": "Only practicing when you feel good", "correct": false}
        ]'::jsonb,
        1
    ),
    (
        'b2222222-2222-2222-2222-222222222222',
        'a2222222-2222-2222-2222-222222222222',
        'Mastering Positive Emotions',
        'Gratitude is the gateway to greatness. Write down three things you are grateful for today. Small things count—the warmth of your tea, a kind word, or a breath of fresh air.',
        'heart-pulse',
        '#004b2c',
        '1. Get a journal or open your notes app.
2. Set a timer for 5 minutes.
3. Write down 3 specific things you''re grateful for.
4. Reflect on why each one matters to you.',
        'Make this a daily habit. The more specific you are, the more powerful the effect. Instead of "I''m grateful for my family," try "I''m grateful for the way my sister made me laugh today."',
        '• Practice gratitude journaling every morning.
• Share your gratitude with someone you appreciate.
• Notice how your mood shifts throughout the day.',
        'Gratitude rewires your brain to focus on abundance rather than scarcity. Studies show it reduces stress, improves sleep, and increases overall happiness.',
        'How can you make gratitude practice more powerful?',
        '[
            {"id": "a", "text": "Write generic statements", "correct": false},
            {"id": "b", "text": "Be specific about what you''re grateful for", "correct": true},
            {"id": "c", "text": "Only do it when you feel good", "correct": false},
            {"id": "d", "text": "Skip the reflection part", "correct": false}
        ]'::jsonb,
        2
    ),
    (
        'b3333333-3333-3333-3333-333333333333',
        'a3333333-3333-3333-3333-333333333333',
        'Always Strive for Greatness',
        'Your mind is the master of your destiny. Challenge one negative thought today. Replace it with a powerful "I can" statement. Greatness is a habit, not a destination.',
        'crown',
        '#FFD700',
        '1. Notice when a negative thought appears.
2. Pause and acknowledge it without judgment.
3. Reframe it into a positive "I can" statement.
4. Repeat the new statement 3 times with conviction.',
        'Don''t fight negative thoughts—transform them. The goal isn''t to eliminate negativity but to build a stronger positive mindset that naturally outweighs it.',
        '• Catch 3 negative thoughts today and reframe them.
• Write down your "I can" statements.
• Share your progress with an accountability partner.',
        'Cognitive reframing is one of the most powerful tools in psychology. It literally changes your brain''s neural pathways, making positive thinking your default mode over time.',
        'What should you do when you notice a negative thought?',
        '[
            {"id": "a", "text": "Ignore it completely", "correct": false},
            {"id": "b", "text": "Acknowledge it and reframe it positively", "correct": true},
            {"id": "c", "text": "Dwell on it to understand it better", "correct": false},
            {"id": "d", "text": "Feel guilty about having it", "correct": false}
        ]'::jsonb,
        3
    ),
    (
        'b4444444-4444-4444-4444-444444444444',
        'a4444444-4444-4444-4444-444444444444',
        'Mentality Fit: The 1% Rule',
        'Don''t try to change everything at once. Just aim to be 1% better than yesterday. Over time, these small gains compound into extraordinary transformations.',
        'trending-up',
        '#87CEEB',
        '1. Choose ONE small habit to improve today.
2. Make it so easy you can''t say no (e.g., 1 push-up, 1 page of reading).
3. Track your progress daily.
4. Celebrate small wins.',
        'Consistency beats intensity. It''s better to do 5 minutes every day than 2 hours once a week. The compound effect of daily 1% improvements is exponential.',
        '• Pick your 1% improvement for today.
• Set a reminder to do it at the same time daily.
• Track your streak and celebrate milestones.',
        'If you improve by just 1% every day for a year, you''ll be 37 times better by the end. This is the power of compound growth applied to personal development.',
        'What is the key to the 1% rule?',
        '[
            {"id": "a", "text": "Making huge changes all at once", "correct": false},
            {"id": "b", "text": "Daily consistency with small improvements", "correct": true},
            {"id": "c", "text": "Only improving when motivated", "correct": false},
            {"id": "d", "text": "Comparing yourself to others", "correct": false}
        ]'::jsonb,
        4
    )
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.wisdom_categories, public.wisdom_lessons TO anon;

-- Grant access to sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
