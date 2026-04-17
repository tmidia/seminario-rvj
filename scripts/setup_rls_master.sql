-- ==========================================
-- SCRIPT MESTRE DE CONFIGURAÇÃO GLOBAL (CORRIGIDO)
-- ==========================================
-- Este script cria tabelas faltantes e configura a segurança.
-- Execute no SQL Editor do seu Dashboard Supabase.

-- 1. CRIAÇÃO DE TABELAS FALTANTES (CERTIFICATE SETTINGS)
CREATE TABLE IF NOT EXISTS public.certificate_settings (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000'::UUID,
    logo_url TEXT,
    seal_url TEXT,
    signature_1_url TEXT,
    signature_1_name TEXT DEFAULT 'Pr. Wagner F. G. da Silva',
    signature_1_role TEXT DEFAULT 'Presidente',
    signature_2_url TEXT,
    signature_2_name TEXT DEFAULT 'Pr. Marcelo da Silva Ribeiro',
    signature_2_role TEXT DEFAULT 'Diretor',
    bg_image_url TEXT,
    layout_scale NUMERIC DEFAULT 1.0,
    margin_top INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT one_row_only CHECK (id = '00000000-0000-0000-0000-000000000000'::UUID)
);

-- Inserir linha padrão se não existir
INSERT INTO public.certificate_settings (id)
VALUES ('00000000-0000-0000-0000-000000000000')
ON CONFLICT (id) DO NOTHING;

-- 2. HABILITAR RLS EM TODAS AS TABELAS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_settings ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS PARA ADMINISTRADORES (ACESSO TOTAL EM TUDO)
DO $$ 
BEGIN
    -- Profiles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin All Access profiles') THEN
        CREATE POLICY "Admin All Access profiles" ON public.profiles FOR ALL TO authenticated USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );
    END IF;
    -- Courses
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin All Access courses') THEN
        CREATE POLICY "Admin All Access courses" ON public.courses FOR ALL TO authenticated USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );
    END IF;
    -- Subjects
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin All Access subjects') THEN
        CREATE POLICY "Admin All Access subjects" ON public.subjects FOR ALL TO authenticated USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );
    END IF;
    -- Exams
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin All Access exams') THEN
        CREATE POLICY "Admin All Access exams" ON public.exams FOR ALL TO authenticated USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );
    END IF;
    -- Questions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin All Access questions') THEN
        CREATE POLICY "Admin All Access questions" ON public.questions FOR ALL TO authenticated USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );
    END IF;
    -- Enrollments
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin All Access enrollments') THEN
        CREATE POLICY "Admin All Access enrollments" ON public.enrollments FOR ALL TO authenticated USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );
    END IF;
    -- Attempts
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin All Access exam_attempts') THEN
        CREATE POLICY "Admin All Access exam_attempts" ON public.exam_attempts FOR ALL TO authenticated USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );
    END IF;
    -- Settings
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin All Access settings') THEN
        CREATE POLICY "Admin All Access settings" ON public.certificate_settings FOR ALL TO authenticated USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );
    END IF;
END $$;

-- 4. POLÍTICAS PARA ALUNOS (CONTEÚDO DIDÁTICO E PESSOAL)
DO $$ 
BEGIN
    -- Didático
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated view courses') THEN
        CREATE POLICY "Authenticated view courses" ON public.courses FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated view subjects') THEN
        CREATE POLICY "Authenticated view subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated view exams') THEN
        CREATE POLICY "Authenticated view exams" ON public.exams FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated view questions') THEN
        CREATE POLICY "Authenticated view questions" ON public.questions FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated view settings') THEN
        CREATE POLICY "Authenticated view settings" ON public.certificate_settings FOR SELECT TO authenticated USING (true);
    END IF;
    
    -- Pessoal
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage own profile') THEN
        CREATE POLICY "Users manage own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students view own enrollments') THEN
        CREATE POLICY "Students view own enrollments" ON public.enrollments FOR SELECT TO authenticated USING (student_id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students manage own attempts') THEN
        CREATE POLICY "Students manage own attempts" ON public.exam_attempts FOR ALL TO authenticated USING (user_id = auth.uid());
    END IF;
END $$;

-- 5. PERMISSÃO DE LEITURA PÚBLICA DE PERFIS (ESTRUTURAL)
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable broad read for profiles') THEN
    CREATE POLICY "Enable broad read for profiles" ON public.profiles FOR SELECT USING (true);
END IF;
