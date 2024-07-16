export type CurrentUserType = {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  current_points: number;
  donation_id: string | null;
  partner_name: string | null;
  unread_messages_count: number;
};

export type PostType = {
  id: string;
  author_id: string;
  created_at: string;
  parent_category_name?: string; // 부모 카테고리 이름
  child_category_name?: string; // 자식 카테고리 이름
  author_name?: string;
  author_email?: string;
  author_avatar_url?: string;
  views?: number;
  comments?: number;
  title?: string;
  likes?: number;
  dislikes?: number;
};
