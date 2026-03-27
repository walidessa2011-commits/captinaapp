import { Suspense } from 'react';
import EditUserContent from './EditUserContent';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <EditUserContent />
    </Suspense>
  );
}
