import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MapPin, Clock, Calendar, Users, MessageSquare,
  ChevronRight, Car, Compass, Camera, Info, Heart, Award, Share2,
  Send, ThumbsUp
} from 'lucide-react';
import { PlaceService } from '../services/PlaceService';
import { ReviewService } from '../services/ReviewService';
import { ThreadService } from '../services/ThreadService';
import { VisitService } from '../services/VisitService';
import { RideService } from '../services/RideService';
import { useAuth } from '../context/AuthContext';
import ScheduleVisit from '../components/places/ScheduleVisit';
import type { IPlace, IReview, IThread, IVisitEvent, IFareEstimate } from '../types';

const PlaceDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [place, setPlace] = useState<IPlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  // Tab data
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [threads, setThreads] = useState<IThread[]>([]);
  const [events, setEvents] = useState<IVisitEvent[]>([]);
  const [fares, setFares] = useState<IFareEstimate[]>([]);
  const [faresLoading, setFaresLoading] = useState(false);

  // Forms
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });
  const [threadForm, setThreadForm] = useState('');
  const [replyForms, setReplyForms] = useState<Record<string, string>>({});
  const [showSchedule, setShowSchedule] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const placeData = await PlaceService.getPlaceById(id!);
        setPlace(placeData);
      } catch (err) {
        console.error('Error fetching place details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    if (activeTab === 'Reviews') {
      ReviewService.getByPlace(id).then(setReviews).catch(console.error);
    } else if (activeTab === 'Community Feed') {
      ThreadService.getByPlace(id).then(setThreads).catch(console.error);
    } else if (activeTab === 'Events') {
      VisitService.getUpcoming(id).then(setEvents).catch(console.error);
    }
  }, [activeTab, id]);

  useEffect(() => {
    if (!place || !place.location || !place.location.coordinates) return;
    const fetchFares = async () => {
      setFaresLoading(true);
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const origin = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
              const destination = {
                latitude: place.location.coordinates[1],
                longitude: place.location.coordinates[0],
              };
              const estimates = await RideService.compareFares(origin, destination);
              setFares(estimates);
              setFaresLoading(false);
            },
            () => {
              const origin = { latitude: 28.6139, longitude: 77.209 };
              const destination = {
                latitude: place.location.coordinates[1],
                longitude: place.location.coordinates[0],
              };
              RideService.compareFares(origin, destination)
                .then(setFares)
                .catch(console.error)
                .finally(() => setFaresLoading(false));
            }
          );
        }
      } catch {
        setFaresLoading(false);
      }
    };
    fetchFares();
  }, [place]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.text.trim()) return;
    setSubmitting(true);
    try {
      await ReviewService.create({ placeId: id!, ...reviewForm });
      const updated = await ReviewService.getByPlace(id!);
      setReviews(updated);
      setReviewForm({ rating: 5, text: '' });
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoteHelpful = async (reviewId: string) => {
    try {
      await ReviewService.voteHelpful(reviewId);
      const updated = await ReviewService.getByPlace(id!);
      setReviews(updated);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadForm.trim()) return;
    setSubmitting(true);
    try {
      await ThreadService.createThread({ placeId: id!, content: threadForm });
      const updated = await ThreadService.getByPlace(id!);
      setThreads(updated);
      setThreadForm('');
    } catch (err) {
      console.error('Error creating thread:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateReply = async (threadId: string) => {
    const content = replyForms[threadId];
    if (!content?.trim()) return;
    try {
      await ThreadService.createReply({ threadId, content });
      const updated = await ThreadService.getByPlace(id!);
      setThreads(updated);
      setReplyForms({ ...replyForms, [threadId]: '' });
    } catch (err) {
      console.error('Error creating reply:', err);
    }
  };

  const handleRSVP = async (eventId: string) => {
    try {
      await VisitService.rsvp(eventId, 'going');
      const updated = await VisitService.getUpcoming(id);
      setEvents(updated);
    } catch (err) {
      console.error('RSVP failed:', err);
    }
  };

  const providerColors: Record<string, { bg: string; text: string; label: string }> = {
    Uber: { bg: 'bg-black', text: 'text-white', label: 'Uber' },
    Ola: { bg: 'bg-green-600', text: 'text-white', label: 'Ola' },
    Rapido: { bg: 'bg-yellow-400', text: 'text-black', label: 'Rapido' },
  };
  
  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
    return `${baseUrl}/${url}`;
  };

  const images = place?.photos?.length ? place.photos.map(getImageUrl) : [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600"
  ];

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
    </div>
  );

  if (!place) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900">Place not found</h1>
        <Link to="/uploads" className="text-blue-600 hover:underline">Return to Experiences</Link>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-50 min-h-screen pb-24"
    >
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom pt-6 pb-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 font-medium">
            <Link to="/uploads" className="hover:text-gray-900 transition-colors">Experiences</Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900">{place.name}</span>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-4 grid-rows-2 gap-3 h-[400px] md:h-[500px] rounded-2xl overflow-hidden"
          >
            <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="col-span-2 row-span-2 relative group overflow-hidden">
              <img src={images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Main View" />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="col-span-1 row-span-1 relative group overflow-hidden">
              <img src={images[1] || images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="View 1" />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="col-span-1 row-span-1 relative group overflow-hidden">
              <img src={images[2] || images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="View 2" />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="col-span-2 row-span-1 relative group overflow-hidden">
              <img src={images[3] || images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="View 3" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                <button className="flex items-center gap-2 bg-white/90 text-gray-900 px-4 py-2 rounded-lg font-medium text-sm shadow-sm hover:bg-white transition-colors">
                  <Camera size={16} /> Show all photos
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main Content Area */}
          <div className="lg:col-span-8 pr-0 lg:pr-8">
            <div className="mb-12">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">{place.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-gray-600 text-lg">
                    <div className="flex items-center gap-1 font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                      <Star size={16} className="fill-gray-900" />
                      <span>{place.averageRating || '4.8'}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 underline cursor-pointer hover:text-gray-900 transition-colors font-medium">{place.totalReviews || '0'} reviews</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 font-medium flex items-center gap-1.5"><MapPin size={18} /> {place.city}</span>
                  </div>
                </div>
                <button
                  onClick={() => setLiked(!liked)}
                  className="flex items-center justify-center bg-white border border-gray-200 text-gray-600 rounded-full w-12 h-12 flex-shrink-0 shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  <Heart size={20} fill={liked ? 'currentColor' : 'none'} className={liked ? 'text-red-500' : ''} />
                </button>
              </div>
            </div>

            <div className="h-px bg-gray-200 w-full mb-10" />

            {/* Navigation Tabs */}
            <div className="flex gap-8 mb-8 overflow-x-auto scrollbar-hide border-b border-gray-200">
              {['Overview', 'Community Feed', 'Reviews', 'Events'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-semibold relative transition-colors whitespace-nowrap px-1 ${
                    activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900" />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="popLayout">
              {/* ─── Overview Tab ──────────────────────────── */}
              {activeTab === 'Overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mb-12 text-gray-800"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                      <Clock className="text-gray-800 mb-3" size={28} />
                      <p className="text-sm font-bold text-gray-900 mb-2">Time Spent</p>
                      <p className="text-gray-500 text-base">{place.suggestedDurationMinutes} mins</p>
                    </div>
                    <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                      <Calendar className="text-gray-800 mb-3" size={28} />
                      <p className="text-sm font-bold text-gray-900 mb-2">Operating Hours</p>
                      <p className="text-gray-500 text-base whitespace-pre-wrap">{place.operatingHours || '9:00 AM - 6:00 PM'}</p>
                    </div>
                    <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                      <Star className="text-gray-800 mb-3" size={28} />
                      <p className="text-sm font-bold text-gray-900 mb-2">Category</p>
                      <p className="text-gray-500 text-base">{place.category || 'General'}</p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-6 text-gray-900">About this place</h3>
                  <p className="text-gray-600 text-lg leading-loose mb-10">{place.description}</p>
                  
                  {place.tags && place.tags.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-12">
                      {place.tags.map((tag: string) => (
                        <span key={tag} className="bg-gray-50 py-2 px-5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="h-px bg-gray-200 w-full mb-12" />
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
                      <Info size={24} className="text-gray-800" /> What to know
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        'Verified Local Context',
                        'Optimized Travel Paths',
                        'Community-Sourced Visuals',
                        'Real-time Access Guides'
                      ].map((tip, i) => (
                        <li key={i} className="flex items-center gap-4 text-lg text-gray-700">
                          <CheckIcon />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* ─── Reviews Tab ──────────────────────────── */}
              {activeTab === 'Reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 text-2xl font-semibold text-gray-900 mb-6">
                    <Star size={24} className="fill-gray-900" />
                    <span>{place.averageRating || '4.8'} out of 5</span>
                  </div>

                  {user && (
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
                       <h4 className="text-lg font-semibold mb-4 text-gray-900">Write a Review</h4>
                       <form onSubmit={handleSubmitReview}>
                         <div className="flex gap-2 mb-4">
                           {[1, 2, 3, 4, 5].map(n => (
                             <button type="button" key={n} onClick={() => setReviewForm({...reviewForm, rating: n})}>
                               <Star size={20} className={n <= reviewForm.rating ? 'fill-gray-900 text-gray-900' : 'text-gray-300'} />
                             </button>
                           ))}
                         </div>
                         <textarea
                           rows={3}
                           className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all resize-none mb-4"
                           placeholder="Share details of your own experience at this place"
                           value={reviewForm.text}
                           onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                           required
                         />
                         <button type="submit" disabled={submitting} className="h-12 px-6 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50">
                           {submitting ? 'Posting...' : 'Post Review'}
                         </button>
                       </form>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.length > 0 ? reviews.map(r => (
                      <div key={r._id} className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                         <div>
                            <div className="flex items-center gap-3 mb-4">
                               <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center font-semibold text-gray-600 text-lg">
                                  {typeof r.userId !== 'string' && r.userId?.avatar ? <img src={r.userId.avatar} className="object-cover w-full h-full" alt="" /> : (typeof r.userId !== 'string' ? r.userId?.name?.charAt(0) : 'U')}
                               </div>
                               <div>
                                  <p className="font-semibold text-gray-900">{typeof r.userId !== 'string' ? r.userId.name : 'Anonymous'}</p>
                                  <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                               </div>
                            </div>
                            <div className="flex gap-1 mb-2">
                               {Array.from({length: 5}).map((_, i) => <Star key={i} size={14} className={i < r.rating ? 'text-gray-900 fill-gray-900' : 'text-gray-200'} />)}
                            </div>
                            <p className="text-[15px] text-gray-700 leading-relaxed mb-4">{r.text}</p>
                         </div>
                         <button onClick={() => handleVoteHelpful(r._id)} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors w-fit border border-gray-200 px-3 py-1.5 rounded-lg active:scale-95">
                           <ThumbsUp size={14} /> Helpful ({r.helpfulVotes || 0})
                         </button>
                      </div>
                    )) : (
                      <div className="col-span-2 text-center py-12 border border-dashed border-gray-300 rounded-2xl bg-white">
                         <p className="text-gray-500 font-medium">No reviews yet.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ─── Community Feed Tab ───────────────────── */}
              {activeTab === 'Community Feed' && (
                <motion.div
                  key="community"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {user && (
                    <form onSubmit={handleCreateThread} className="relative p-6 bg-white border border-gray-200 rounded-2xl shadow-sm flex gap-3">
                       <input
                         type="text"
                         className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-200 focus:outline-none"
                         placeholder="Start a discussion or ask a question..."
                         value={threadForm}
                         onChange={(e) => setThreadForm(e.target.value)}
                         required
                       />
                       <button type="submit" disabled={submitting} className="h-[46px] px-6 bg-gray-900 text-white font-semibold rounded-xl text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors">
                         <Send size={16} /> Post
                       </button>
                    </form>
                  )}
                  
                  <div className="space-y-4">
                     {threads.length > 0 ? threads.map(t => (
                       <div key={t.id} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                          <div className="flex items-center gap-3 mb-3">
                             <div className="w-10 h-10 rounded-full font-bold bg-blue-100 text-blue-800 flex items-center justify-center text-sm">{t.userName?.charAt(0)}</div>
                             <div>
                                <h4 className="font-semibold text-gray-900 text-sm">{t.userName}</h4>
                                <p className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</p>
                             </div>
                          </div>
                          <p className="text-[15px] text-gray-800 mb-4">{t.content}</p>
                          
                          {t.replies?.length > 0 && (
                            <div className="pl-6 border-l-2 border-gray-100 space-y-4 mb-4">
                               {t.replies.map(rep => (
                                 <div key={rep.id} className="bg-gray-50 p-4 rounded-xl">
                                    <div className="flex items-center gap-2 mb-1">
                                       <span className="font-semibold text-sm text-gray-900">{rep.userName}</span>
                                       <span className="text-xs text-gray-400">{new Date(rep.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{rep.content}</p>
                                 </div>
                               ))}
                            </div>
                          )}
                          
                          {user && (
                            <div className="flex gap-2">
                               <input 
                                 type="text" 
                                 className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 hover:border-gray-300 focus:border-gray-400 outline-none transition-colors"
                                 placeholder="Add a reply..."
                                 value={replyForms[t.id] || ''}
                                 onChange={(e) => setReplyForms({...replyForms, [t.id]: e.target.value})}
                                 onKeyDown={(e) => e.key === 'Enter' && handleCreateReply(t.id)}
                               />
                               <button onClick={() => handleCreateReply(t.id)} className="px-4 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-gray-900 font-semibold text-sm transition-colors">
                                 Reply
                               </button>
                            </div>
                          )}
                       </div>
                     )) : (
                       <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
                          <MessageSquare className="mx-auto text-gray-300 mb-3" size={32} />
                          <p className="text-gray-500 font-medium text-sm">No discussions yet. Be the first to start one!</p>
                       </div>
                     )}
                  </div>
                </motion.div>
              )}

              {/* ─── Events Tab ────────────────────────────── */}
              {activeTab === 'Events' && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-2">
                     <div>
                        <h4 className="text-lg font-semibold text-gray-900">Group Visits</h4>
                        <p className="text-sm text-gray-500">Plan a visit with others or join an existing trip.</p>
                     </div>
                     {user && (
                       <button onClick={() => setShowSchedule(true)} className="h-12 px-6 font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2">
                          <Calendar size={18} /> Schedule Trip
                       </button>
                     )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.length > 0 ? events.map(e => (
                      <div key={e._id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                         <div>
                            <div className="flex items-center justify-between mb-3">
                               <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${e.visibility === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{e.visibility === 'open' ? 'Open' : 'Invite Only'}</span>
                               <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5"><Users size={14}/> {e.currentParticipants || 0}/{e.maxParticipants}</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 text-lg mb-1">{e.title}</h4>
                            <p className="text-sm text-gray-600 mb-4">{e.description}</p>
                            <div className="flex items-center gap-4 text-sm font-medium text-gray-700 mb-6 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                               <div className="flex items-center gap-2"><Calendar size={16} className="text-gray-400" /> {new Date(e.scheduledDate).toLocaleDateString()}</div>
                               <div className="flex items-center gap-2"><Clock size={16} className="text-gray-400" /> {e.time}</div>
                            </div>
                         </div>
                         {user && (
                           <button onClick={() => handleRSVP(e._id)} className="h-12 w-full font-semibold bg-white border border-gray-300 text-gray-900 rounded-xl hover:border-gray-900 transition-colors">
                             Join Visit
                           </button>
                         )}
                      </div>
                    )) : (
                      <div className="col-span-2 text-center py-12 rounded-2xl border border-dashed border-gray-300 bg-white">
                         <p className="text-gray-500 font-medium">No upcoming events found.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── Sidebar Area ─── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
               
               {/* Context Action Card */}
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex items-baseline gap-2 mb-6">
                     <span className="text-2xl font-bold text-gray-900">₹0</span>
                     <span className="text-sm font-medium text-gray-500">Entrance</span>
                  </div>
                  <div className="flex flex-col gap-3">
                     <button onClick={() => setShowSchedule(true)} className="h-12 w-full bg-[#E51D53] hover:bg-[#D41648] text-white rounded-xl font-semibold text-base transition-colors active:scale-[0.98]">
                       Reserve a Plan
                     </button>
                     <button onClick={() => setActiveTab('Community Feed')} className="h-12 w-full bg-white text-gray-900 border border-gray-300 rounded-xl font-semibold text-base hover:border-gray-900 hover:bg-gray-50 transition-colors active:scale-[0.98]">
                       Ask the Community
                     </button>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-4">You won't be charged yet</p>
               </div>

               {/* Ride Logistics Card */}
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-5">
                     <h3 className="font-semibold text-gray-900 text-lg">
                        Ride Estimates
                     </h3>
                     <Car size={20} className="text-gray-400" />
                  </div>
                  
                  <div className="space-y-3">
                     {faresLoading ? (
                        <>
                          <div className="h-16 bg-gray-50 rounded-xl animate-pulse" />
                          <div className="h-16 bg-gray-50 rounded-xl animate-pulse opacity-50" />
                        </>
                     ) : fares.length > 0 ? (
                        fares.map((f, i) => {
                           const prov = providerColors[f.provider] || { bg: 'bg-gray-800', text: 'text-white', label: f.provider };
                           return (
                             <div key={i} className="flex justify-between items-center py-2 group cursor-pointer border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                                <div className="flex items-center gap-3">
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${prov.bg} ${prov.text}`}>
                                      {prov.label === 'Uber' ? 'U' : prov.label === 'Ola' ? 'O' : prov.label === 'Rapido' ? 'R' : '!'}
                                   </div>
                                   <div>
                                      <p className="text-sm font-semibold text-gray-900">{f.provider}</p>
                                      <p className="text-[13px] text-gray-500 mt-0.5">{f.estimatedMinutes} min • {f.distanceKm} km</p>
                                   </div>
                                </div>
                                <span className={`text-base font-semibold ${i === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                   ₹{f.fare}
                                </span>
                             </div>
                           );
                        })
                     ) : (
                        <div className="text-center py-5 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-sm text-gray-500">
                           Enable location to get ride estimates.
                        </div>
                     )}
                  </div>
                  <Link to="/map" className="block text-center text-[13px] font-semibold text-gray-900 underline mt-5 hover:text-gray-600">
                     Compare all mobility options
                  </Link>
               </div>
               
               {/* Location / Safety Box */}
               <div className="bg-white p-6 rounded-2xl border border-gray-200 flex gap-4">
                  <div className="mt-1">
                     <Award size={24} className="text-gray-900" />
                  </div>
                  <div>
                     <h3 className="font-semibold text-gray-900 text-base mb-1">
                        Community Verified
                     </h3>
                     <p className="text-sm text-gray-500 leading-relaxed">
                        Every experience is reviewed dynamically. Content and tips reflect recent community feedback.
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Visit Modal */}
      {showSchedule && place && (
        <ScheduleVisit
          placeId={place._id}
          placeName={place.name}
          onClose={() => setShowSchedule(false)}
          onCreated={() => {
             VisitService.getUpcoming(id!).then(setEvents).catch(console.error);
          }}
        />
      )}
    </motion.div>
  );
};

// SVG Icon Helper
const CheckIcon = () => (
   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-900" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
   </svg>
);

export default PlaceDetails;
