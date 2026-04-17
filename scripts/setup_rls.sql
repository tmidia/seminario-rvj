-- CONFIGURAÇÃO DE RLS (Row Level Security)
-- Execute este script no SQL Editor do seu Dashboard Supabase.

-- 1. Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICAS PARA PROFILES
-- Permitir que Admins leiam todos os perfis
CREATE POLICY "Admins can read all profiles" 
ON public.profiles FOR SELECT 
TO authenticated 
USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- Permitir que usuários leiam seu próprio perfil
CREATE POLICY "Users can read own profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING ( auth.uid() = id );

-- 3. POLÍTICAS PARA COURSES, SUBJECTS, EXAMS
-- Todos os usuários autenticados podem ler a estrutura do curso
CREATE POLICY "Anyone can read courses" ON public.courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read exams" ON public.exams FOR SELECT TO authenticated USING (true);

-- 4. POLÍTICAS PARA ENROLLMENTS
-- Admins podem ler todas as matrículas
CREATE POLICY "Admins can read all enrollments" 
ON public.enrollments FOR SELECT 
TO authenticated 
USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- Alunos podem ler suas próprias matrículas
CREATE POLICY "Students can read own enrollments" 
ON public.enrollments FOR SELECT 
TO authenticated 
USING ( student_id = auth.uid() );

-- 5. POLÍTICAS PARA EXAM_ATTEMPTS
-- Admins podem ler todas as tentativas
CREATE POLICY "Admins can read all attempts" 
ON public.exam_attempts FOR SELECT 
TO authenticated 
USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- Alunos podem ler suas próprias tentativas
CREATE POLICY "Students can read own attempts" 
ON public.exam_attempts FOR SELECT 
TO authenticated 
USING ( user_id = auth.uid() );
