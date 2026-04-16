import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. استخراج معلومات المستخدم (مثلاً من الـ Cookies)
  const token = request.cookies.get('auth_token')?.value;
  const isFirstTime = request.cookies.get('is_first_time')?.value; // توضح هل هو أول دخول

  // 2. إذا كان المستخدم يحاول الدخول لصفحة محمية وهو غير مسجل
  if (!token && pathname !== '/sign-in' && pathname !== '/sign-up') {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // 3. إذا كان المستخدم مسجلاً بالفعل
  if (token) {
    // إذا كان في صفحة تسجيل الدخول، حوله للصفحة الرئيسية
    if (pathname === '/sign-in' || pathname === '/sign-up') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 4. فحص هل هي أول مرة (للتحقق من إكمال بيانات الحساب)
    if (isFirstTime === 'true' && pathname !== '/onboarding') {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  return NextResponse.next();
}

// تحديد المسارات التي يعمل عليها الـ Middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};