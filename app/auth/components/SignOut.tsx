import { Button } from '@/components/ui/button';
import createSupabaseServerClient from '@/lib/supabse/server';
import { redirect } from 'next/navigation';

export default async function SignOut() {
  const logout = async () => {
    'use server';

    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect('/goodbye');
  };

  return (
    <form action={logout}>
      <Button>SignOut</Button>
    </form>
  );
}
