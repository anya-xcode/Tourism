import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => (
  <section className="page-wrap flex flex-1 flex-col justify-center py-24">
    <p className="font-display text-[5rem] leading-none text-madder" aria-hidden="true">
      404
    </p>
    <h1 className="mt-4 max-w-[18ch] font-display text-[2.4rem] leading-[1.05] text-iron md:text-[3rem]">
      This page isn't in the collection.
    </h1>
    <p className="mt-4 max-w-[50ch] text-[1.1rem] text-iron-2">
      The link may be old, or the place may have been removed. Everything else is still where you left it.
    </p>
    <div className="mt-8 flex flex-wrap gap-3">
      <Link to="/" className="btn-ink">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Discover
      </Link>
      <Link to="/uploads" className="btn-line">
        Browse all places
      </Link>
    </div>
  </section>
);

export default NotFound;
