export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "admin" | "client" | "collaborator";

export type EnquiryStatus =
  | "new"
  | "reviewed"
  | "discovery_scheduled"
  | "proposal_sent"
  | "won"
  | "archived";

export type ProposalStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "declined"
  | "expired";

export type ProjectStatus =
  | "onboarding"
  | "active"
  | "in_review"
  | "completed"
  | "on_hold";

export type MilestoneStatus =
  | "pending"
  | "in_progress"
  | "in_review"
  | "completed";

export type DeliverableCategory =
  | "brand"
  | "figma"
  | "staging"
  | "code"
  | "document"
  | "asset";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company_name: string | null;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          company_name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          company_name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      studio_projects: {
        Row: {
          id: string;
          sequence: string;
          year: string;
          title: string;
          disciplines: string;
          image: string;
          image_alt: string;
          href: string | null;
          featured: boolean;
          is_published: boolean;
          sort_order: number;
          case_study: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          sequence: string;
          year?: string;
          title: string;
          disciplines: string;
          image: string;
          image_alt: string;
          href?: string | null;
          featured?: boolean;
          is_published?: boolean;
          sort_order?: number;
          case_study?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sequence?: string;
          year?: string;
          title?: string;
          disciplines?: string;
          image?: string;
          image_alt?: string;
          href?: string | null;
          featured?: boolean;
          is_published?: boolean;
          sort_order?: number;
          case_study?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_pages_content: {
        Row: {
          id: string;
          title: string;
          content: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      enquiries: {
        Row: {
          id: string;
          user_id: string | null;
          client_name: string;
          client_email: string;
          client_company: string | null;
          services: Json;
          package_selected: string | null;
          scope_answers: Json;
          budget_range: string | null;
          timeline: string | null;
          status: EnquiryStatus;
          admin_notes: string | null;
          submission_id: string | null;
          source: string;
          consent_at: string | null;
          assistant_used: boolean;
          ai_recommended_package: string | null;
          ai_summary: string | null;
          ai_tags: Json;
          ai_spam_score: number | null;
          ai_triaged_at: string | null;
          quoted_amount: number | null;
          lost_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          client_name: string;
          client_email: string;
          client_company?: string | null;
          services?: Json;
          package_selected?: string | null;
          scope_answers?: Json;
          budget_range?: string | null;
          timeline?: string | null;
          status?: EnquiryStatus;
          admin_notes?: string | null;
          submission_id?: string | null;
          source?: string;
          consent_at?: string | null;
          assistant_used?: boolean;
          ai_recommended_package?: string | null;
          ai_summary?: string | null;
          ai_tags?: Json;
          ai_spam_score?: number | null;
          ai_triaged_at?: string | null;
          quoted_amount?: number | null;
          lost_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          client_name?: string;
          client_email?: string;
          client_company?: string | null;
          services?: Json;
          package_selected?: string | null;
          scope_answers?: Json;
          budget_range?: string | null;
          timeline?: string | null;
          status?: EnquiryStatus;
          admin_notes?: string | null;
          submission_id?: string | null;
          source?: string;
          consent_at?: string | null;
          assistant_used?: boolean;
          ai_recommended_package?: string | null;
          ai_summary?: string | null;
          ai_tags?: Json;
          ai_spam_score?: number | null;
          ai_triaged_at?: string | null;
          quoted_amount?: number | null;
          lost_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      proposals: {
        Row: {
          id: string;
          enquiry_id: string | null;
          client_id: string;
          title: string;
          overview: string | null;
          deliverables: Json;
          timeline_summary: string | null;
          total_amount: number;
          currency: string;
          status: ProposalStatus;
          valid_until: string | null;
          accepted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          enquiry_id?: string | null;
          client_id: string;
          title: string;
          overview?: string | null;
          deliverables?: Json;
          timeline_summary?: string | null;
          total_amount?: number;
          currency?: string;
          status?: ProposalStatus;
          valid_until?: string | null;
          accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          enquiry_id?: string | null;
          client_id?: string;
          title?: string;
          overview?: string | null;
          deliverables?: Json;
          timeline_summary?: string | null;
          total_amount?: number;
          currency?: string;
          status?: ProposalStatus;
          valid_until?: string | null;
          accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      client_projects: {
        Row: {
          id: string;
          client_id: string;
          proposal_id: string | null;
          name: string;
          slug: string;
          current_phase: string;
          status: ProjectStatus;
          start_date: string | null;
          target_completion_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          proposal_id?: string | null;
          name: string;
          slug: string;
          current_phase?: string;
          status?: ProjectStatus;
          start_date?: string | null;
          target_completion_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          proposal_id?: string | null;
          name?: string;
          slug?: string;
          current_phase?: string;
          status?: ProjectStatus;
          start_date?: string | null;
          target_completion_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      milestones: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          order_index: number;
          status: MilestoneStatus;
          due_date: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          order_index?: number;
          status?: MilestoneStatus;
          due_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          order_index?: number;
          status?: MilestoneStatus;
          due_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      deliverables: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          category: DeliverableCategory;
          file_url: string | null;
          external_url: string | null;
          notes: string | null;
          is_final: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          category?: DeliverableCategory;
          file_url?: string | null;
          external_url?: string | null;
          notes?: string | null;
          is_final?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          category?: DeliverableCategory;
          file_url?: string | null;
          external_url?: string | null;
          notes?: string | null;
          is_final?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      time_entries: {
        Row: {
          id: string;
          project_id: string;
          milestone_id: string | null;
          user_id: string | null;
          phase: string | null;
          hours: number;
          work_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          milestone_id?: string | null;
          user_id?: string | null;
          phase?: string | null;
          hours: number;
          work_date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          milestone_id?: string | null;
          user_id?: string | null;
          phase?: string | null;
          hours?: number;
          work_date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_runs: {
        Row: {
          id: string;
          feature: string;
          model: string;
          ref_id: string | null;
          input_chars: number | null;
          output: Json | null;
          prompt_tokens: number | null;
          output_tokens: number | null;
          latency_ms: number | null;
          ok: boolean;
          error: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          feature: string;
          model: string;
          ref_id?: string | null;
          input_chars?: number | null;
          output?: Json | null;
          prompt_tokens?: number | null;
          output_tokens?: number | null;
          latency_ms?: number | null;
          ok?: boolean;
          error?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          feature?: string;
          model?: string;
          ref_id?: string | null;
          input_chars?: number | null;
          output?: Json | null;
          prompt_tokens?: number | null;
          output_tokens?: number | null;
          latency_ms?: number | null;
          ok?: boolean;
          error?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      enquiry_status: EnquiryStatus;
      proposal_status: ProposalStatus;
      project_status: ProjectStatus;
      milestone_status: MilestoneStatus;
      deliverable_category: DeliverableCategory;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
