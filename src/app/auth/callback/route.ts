import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const next = searchParams.get('next') ?? '/';

  // エラーパラメータがある場合
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_error`);
  }

  // codeがある場合（初回認証時）
  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // SSR環境でのcookie設定エラーを無視
            }
          },
        },
      }
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      const response = NextResponse.redirect(`${origin}${next}`);
      
      // Set cookies in the response
      const allCookies = cookieStore.getAll();
      allCookies.forEach(({ name, value }) => {
        response.cookies.set(name, value, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
      });
      
      return response;
    }
    
    return NextResponse.redirect(`${origin}/login?error=auth_error`);
  }

  return NextResponse.redirect(`${origin}/login`);
}
