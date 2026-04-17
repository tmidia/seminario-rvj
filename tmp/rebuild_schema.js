const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ukuacwjiaeqhkidskrjb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdWFjd2ppYWVxaGtpZHNrcmpiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE5NjAyNSwiZXhwIjoyMDg0NzcyMDI1fQ.tolcqz7ma6ORJNYTHpkNMn-Iq7sF8nBXYm9_YAswcno';

const supabase = createClient(supabaseUrl, supabaseKey);

const sql = `
-- 1. ESTRUTURA BÁSICA
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'aluno',
    status TEXT NOT NULL DEFAULT 'ativo',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.courses (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subjects (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exams (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    time_limit_minutes INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    allowed_courses INTEGER[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.questions (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES public.exams(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option TEXT NOT NULL,
    points INTEGER DEFAULT 1,
    order_index INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.enrollments (
    id SERIAL PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES public.exams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    score NUMERIC(4,2),
    status TEXT DEFAULT 'in_progress',
    answers JSONB DEFAULT '{}',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FUNÇÃO RPC (CADASTRO)
CREATE OR REPLACE FUNCTION public.admin_create_student(
  p_cpf TEXT,
  p_full_name TEXT,
  p_course_ids INTEGER[]
) RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
  v_course_id INTEGER;
BEGIN
  v_email := p_cpf || '.rvj@gmail.com';
  
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, aud, instance_id)
  VALUES (gen_random_uuid(), v_email, crypt('Rvj@' || p_cpf, gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000')
  ON CONFLICT (email) DO NOTHING;

  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  INSERT INTO public.profiles (id, full_name, cpf, role, status)
  VALUES (v_user_id, p_full_name, p_cpf, 'aluno', 'ativo')
  ON CONFLICT (id) DO UPDATE SET full_name = p_full_name, cpf = p_cpf;

  DELETE FROM public.enrollments WHERE student_id = v_user_id;
  FOREACH v_course_id IN ARRAY p_course_ids LOOP
    INSERT INTO public.enrollments (student_id, course_id) VALUES (v_user_id, v_course_id);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

async function rebuild() {
  console.log("Rebuilding database schema...");
  
  // Running SQL via RPC if possible or execute direct if using a helper
  // But wait, standard Supabase JS doesn't have a 'run sql' function. 
  // I will have to advise the user to run this in the SQL Editor.
  console.log("Since I cannot run raw SQL via JS client without a custom RPC, please run the SQL script in your dashboard.");
}

rebuild();
