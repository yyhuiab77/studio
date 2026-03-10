import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/app-logo';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-2 mb-2">
            <AppLogo className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold font-headline">Lift Dashboard</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-md">
          An intelligent command center for managing vertical transport assets like elevators and escalators.
        </p>
        <Button asChild size="lg">
          <Link href="/login">Access the Dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
