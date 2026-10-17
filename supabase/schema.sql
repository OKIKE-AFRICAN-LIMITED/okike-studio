-- OKIKE Studio: Supabase Database Schema & RLS Policies
-- Execute this script in your Supabase Project's SQL Editor (Dashboard > SQL Editor)

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'client', 'collaborator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enquiry_status AS ENUM (
        'new',
        'reviewed',
        'discovery_scheduled',
        'proposal_sent',
        'won',
        'archived'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE proposal_status AS ENUM (
        'draft',
        'sent',
        'accepted',
        'declined',
        'expired'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM (
        'onboarding',
        'active',
        'in_review',
        'completed',
        'on_hold'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE milestone_status AS ENUM (
        'pending',
        'in_progress',
        'in_review',
        'completed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE deliverable_category AS ENUM (
        'brand',
        'figma',
        'staging',
        'code',
        'document',
        'asset'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. USER PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    company_name TEXT,
    role user_role NOT NULL DEFAULT 'client',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger to create public.profile when a user registers or gets invited
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
    assigned_role public.user_role := 'client'::public.user_role;
    raw_role text;
BEGIN
    raw_role := new.raw_user_meta_data->>'role';
    IF raw_role = 'admin' THEN
        assigned_role := 'admin'::public.user_role;
    ELSIF raw_role = 'collaborator' THEN
        assigned_role := 'collaborator'::public.user_role;
    ELSE
        assigned_role := 'client'::public.user_role;
    END IF;

    INSERT INTO public.profiles (id, email, full_name, company_name, role)
    VALUES (
        new.id,
        COALESCE(new.email, ''),
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        COALESCE(new.raw_user_meta_data->>'company_name', ''),
        assigned_role
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = CASE WHEN EXCLUDED.full_name <> '' THEN EXCLUDED.full_name ELSE profiles.full_name END,
        company_name = CASE WHEN EXCLUDED.company_name <> '' THEN EXCLUDED.company_name ELSE profiles.company_name END,
        updated_at = timezone('utc'::text, now());

    RETURN new;
EXCEPTION
    WHEN OTHERS THEN
        RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql STABLE
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$;

-- 3. CMS: STUDIO SHOWCASE PROJECTS & CASE STUDIES
CREATE TABLE IF NOT EXISTS public.studio_projects (
    id TEXT PRIMARY KEY, -- e.g. 'koro', 'north-common'
    sequence TEXT NOT NULL, -- e.g. '01', '02'
    year TEXT NOT NULL DEFAULT '2026',
    title TEXT NOT NULL,
    disciplines TEXT NOT NULL,
    image TEXT NOT NULL,
    image_alt TEXT NOT NULL,
    href TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    case_study JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3b. CMS: EDITABLE PUBLIC PAGES CONTENT
CREATE TABLE IF NOT EXISTS public.site_pages_content (
    id TEXT PRIMARY KEY, -- e.g. 'home', 'services', 'studio', 'settings'
    title TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CRM: ENQUIRIES & LEADS
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_company TEXT,
    services JSONB NOT NULL DEFAULT '[]'::jsonb,
    package_selected TEXT,
    scope_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    budget_range TEXT,
    timeline TEXT,
    status enquiry_status NOT NULL DEFAULT 'new',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. CRM: PROPOSALS
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    overview TEXT,
    deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
    timeline_summary TEXT,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    status proposal_status NOT NULL DEFAULT 'draft',
    valid_until TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. CLIENT ACTIVE PROJECTS & SPACES
CREATE TABLE IF NOT EXISTS public.client_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    current_phase TEXT NOT NULL DEFAULT 'Discovery & Strategy',
    status project_status NOT NULL DEFAULT 'active',
    start_date DATE DEFAULT CURRENT_DATE,
    target_completion_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. PROJECT MILESTONES
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.client_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INT NOT NULL DEFAULT 0,
    status milestone_status NOT NULL DEFAULT 'pending',
    due_date DATE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. PROJECT DELIVERABLES & ASSETS
CREATE TABLE IF NOT EXISTS public.deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.client_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category deliverable_category NOT NULL DEFAULT 'asset',
    file_url TEXT,
    external_url TEXT,
    notes TEXT,
    is_final BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pages_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

-- 10. RLS POLICIES

-- PROFILES
DROP POLICY IF EXISTS "Public profiles can view own profile" ON public.profiles;
CREATE POLICY "Public profiles can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin());

-- STUDIO_PROJECTS (CMS)
DROP POLICY IF EXISTS "Public read published studio projects" ON public.studio_projects;
CREATE POLICY "Public read published studio projects"
    ON public.studio_projects FOR SELECT
    USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins full access to studio projects" ON public.studio_projects;
CREATE POLICY "Admins full access to studio projects"
    ON public.studio_projects FOR ALL
    USING (public.is_admin());

-- SITE_PAGES_CONTENT (CMS)
DROP POLICY IF EXISTS "Public read site pages content" ON public.site_pages_content;
CREATE POLICY "Public read site pages content"
    ON public.site_pages_content FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins full access to site pages content" ON public.site_pages_content;
CREATE POLICY "Admins full access to site pages content"
    ON public.site_pages_content FOR ALL
    USING (public.is_admin());

-- ENQUIRIES
DROP POLICY IF EXISTS "Anyone can submit an enquiry" ON public.enquiries;
CREATE POLICY "Anyone can submit an enquiry"
    ON public.enquiries FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Clients read own enquiries" ON public.enquiries;
CREATE POLICY "Clients read own enquiries"
    ON public.enquiries FOR SELECT
    USING (user_id = auth.uid() OR client_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR public.is_admin());

DROP POLICY IF EXISTS "Admins full access to enquiries" ON public.enquiries;
CREATE POLICY "Admins full access to enquiries"
    ON public.enquiries FOR ALL
    USING (public.is_admin());

-- PROPOSALS
DROP POLICY IF EXISTS "Clients view own proposals" ON public.proposals;
CREATE POLICY "Clients view own proposals"
    ON public.proposals FOR SELECT
    USING (client_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Clients can update status of own proposal" ON public.proposals;
CREATE POLICY "Clients can update status of own proposal"
    ON public.proposals FOR UPDATE
    USING (client_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage all proposals" ON public.proposals;
CREATE POLICY "Admins manage all proposals"
    ON public.proposals FOR ALL
    USING (public.is_admin());

-- CLIENT_PROJECTS
DROP POLICY IF EXISTS "Clients read own projects" ON public.client_projects;
CREATE POLICY "Clients read own projects"
    ON public.client_projects FOR SELECT
    USING (client_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage client projects" ON public.client_projects;
CREATE POLICY "Admins manage client projects"
    ON public.client_projects FOR ALL
    USING (public.is_admin());

-- MILESTONES
DROP POLICY IF EXISTS "Clients view milestones for their projects" ON public.milestones;
CREATE POLICY "Clients view milestones for their projects"
    ON public.milestones FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.client_projects cp
            WHERE cp.id = milestones.project_id AND (cp.client_id = auth.uid() OR public.is_admin())
        )
    );

DROP POLICY IF EXISTS "Admins manage milestones" ON public.milestones;
CREATE POLICY "Admins manage milestones"
    ON public.milestones FOR ALL
    USING (public.is_admin());

-- DELIVERABLES
DROP POLICY IF EXISTS "Clients view deliverables for their projects" ON public.deliverables;
CREATE POLICY "Clients view deliverables for their projects"
    ON public.deliverables FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.client_projects cp
            WHERE cp.id = deliverables.project_id AND (cp.client_id = auth.uid() OR public.is_admin())
        )
    );

DROP POLICY IF EXISTS "Admins manage deliverables" ON public.deliverables;
CREATE POLICY "Admins manage deliverables"
    ON public.deliverables FOR ALL
    USING (public.is_admin());
