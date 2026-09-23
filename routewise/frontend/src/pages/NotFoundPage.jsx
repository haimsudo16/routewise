import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-950 text-center px-4">
      <Compass className="text-accent" size={40} />
      <h1 className="text-3xl font-bold text-white">Off the route</h1>
      <p className="max-w-sm text-slate-400">
        This page doesn't exist. Let's get you back on the fastest path.
      </p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
