import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge.jsx';
import TimelineItem from '@/components/TimelineItem.jsx';
import BottomNav from '@/components/BottomNav.jsx';
import supabase from '@/lib/supabaseClient';
import APP_CONFIG from '@/config/app.js';

const SignalementDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [signalement, setSignalement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignalement();
  }, [id]);

  const fetchSignalement = async () => {
    try {
      const { data, error } = await supabase
        .from('signalements')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      setSignalement(data);
    } catch (error) {
      console.error('Error fetching signalement:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F7FF' }}>
        <div style={{ color: '#6B7280' }}>Chargement...</div>
      </div>
    );
  }

  if (!signalement) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F7FF' }}>
        <div style={{ color: '#0D1B4A' }}>Signalement introuvable</div>
      </div>
    );
  }

  const photoUrl = signalement.photo_url || null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimelineItems = () => {
    const items = [
      {
        status: 'Reçu',
        date: formatDate(signalement.created_at),
        label: 'Reçu',
        color: '#3B82F6',
      },
    ];

    if (signalement.statut === 'En cours' || signalement.statut === 'Résolu' || signalement.statut === 'Fermé') {
      items.push({
        status: 'En cours',
        date: formatDate(signalement.updated_at),
        label: 'Pris en charge',
        color: '#F59E0B',
      });
    }

    if (signalement.statut === 'Résolu' || signalement.statut === 'Fermé') {
      items.push({
        status: 'Résolu',
        date: formatDate(signalement.updated_at),
        label: 'Résolu',
        color: '#16A34A',
      });
    }

    return items;
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F5F7FF' }}>
      <Helmet>
        <title>{`Signalement ${signalement.reference || `#${signalement.id.slice(0, 6)}`} - ${APP_CONFIG.appName}`}</title>
      </Helmet>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-[430px] mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} style={{ color: '#0D1B4A' }}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-xl" style={{ color: '#0D1B4A' }}>
            Signalement {signalement.reference || `#${signalement.id.slice(0, 6)}`}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[430px] mx-auto px-4 pt-20">
        {photoUrl && (
          <div className="mb-6">
            <img
              src={photoUrl}
              alt="Photo du signalement"
              className="w-full h-48 object-cover rounded-2xl"
            />
          </div>
        )}

        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <div className="mb-4">
            <StatusBadge status={signalement.statut || 'Nouveau'} />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Catégorie</p>
              <p className="font-medium" style={{ color: '#0D1B4A' }}>{signalement.categorie}</p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Adresse</p>
              <p style={{ color: '#0D1B4A' }}>{signalement.adresse}</p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Date</p>
              <p style={{ color: '#0D1B4A' }}>{formatDate(signalement.created_at)}</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <h2 className="font-bold text-lg mb-3" style={{ color: '#0D1B4A' }}>Description</h2>
          <p className="leading-relaxed" style={{ color: '#0D1B4A' }}>{signalement.description}</p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <h2 className="font-bold text-lg mb-4" style={{ color: '#0D1B4A' }}>Suivi</h2>
          <div>
            {getTimelineItems().map((item, index) => (
              <TimelineItem
                key={index}
                status={item.status}
                date={item.date}
                label={item.label}
                color={item.color}
                isLast={index === getTimelineItems().length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default SignalementDetailPage;