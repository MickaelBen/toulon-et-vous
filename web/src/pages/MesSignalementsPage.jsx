import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import SignalementCard from '@/components/SignalementCard.jsx';
import BottomNav from '@/components/BottomNav.jsx';
import supabase from '@/lib/supabaseClient';
import { FileX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import APP_CONFIG from '@/config/app.js';

const MesSignalementsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tous');

  const tabs = ['Tous', 'En cours', 'Résolus'];

  useEffect(() => {
    fetchSignalements();
  }, [currentUser]);

  const fetchSignalements = async () => {
    try {
      const { data, error } = await supabase
        .from('signalements')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSignalements(data || []);
    } catch (error) {
      console.error('Error fetching signalements:', error);
    }
    setLoading(false);
  };

  const filteredSignalements = signalements.filter((s) => {
    if (activeTab === 'Tous') return true;
    if (activeTab === 'En cours') return s.statut === 'Nouveau' || s.statut === 'En cours';
    if (activeTab === 'Résolus') return s.statut === 'Résolu' || s.statut === 'Fermé';
    return true;
  });

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--bg-page)' }}>
      <Helmet>
        <title>Mes signalements - {APP_CONFIG.appName}</title>
      </Helmet>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40" style={{ backgroundColor: 'var(--bg-header)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[430px] mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-bold text-xl" style={{ color: 'var(--text-main)' }}>Mes signalements</h1>
          <span
            className="px-3 py-1 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: '#2563EB' }}
          >
            {signalements.length}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="fixed top-16 left-0 right-0 z-40" style={{ backgroundColor: 'var(--bg-header)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[430px] mx-auto px-4 py-3">
          <div
            className="inline-flex rounded-full p-1"
            style={{ background: 'var(--tab-pill-bg)' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: activeTab === tab ? '#E8192C' : 'transparent',
                  color: activeTab === tab ? '#FFFFFF' : 'var(--text-main)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[430px] mx-auto px-4 pt-32">
        {loading ? (
          <div className="text-center py-12" style={{ color: 'var(--text-sub)' }}>Chargement...</div>
        ) : filteredSignalements.length === 0 ? (
          <div className="text-center py-12">
            <FileX className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} size={64} />
            <h2 className="font-bold text-xl mb-2" style={{ color: 'var(--text-main)' }}>Aucun signalement</h2>
            <p className="mb-6" style={{ color: 'var(--text-sub)' }}>Vous n'avez pas encore fait de signalement</p>
            <button
              onClick={() => navigate('/signaler')}
              className="px-6 py-3 rounded-2xl font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-98"
              style={{ backgroundColor: '#E8192C' }}
            >
              Faire mon premier signalement
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSignalements.map((signalement) => (
              <SignalementCard key={signalement.id} signalement={signalement} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default MesSignalementsPage;