import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge.jsx';
import TimelineItem from '@/components/TimelineItem.jsx';
import BottomNav from '@/components/BottomNav.jsx';
import pb from '@/lib/pocketbaseClient';

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
      const record = await pb.collection('signalements').getOne(id, { $autoCancel: false });
      setSignalement(record);
    } catch (error) {
      console.error('Error fetching signalement:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1B2A6B' }}>
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (!signalement) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1B2A6B' }}>
        <div className="text-white">Signalement introuvable</div>
      </div>
    );
  }

  const photoUrl = signalement.photo
    ? pb.files.getUrl(signalement, signalement.photo)
    : null;

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
        date: formatDate(signalement.created),
        label: 'Reçu',
        color: '#3B82F6',
      },
    ];

    if (signalement.statut === 'En cours' || signalement.statut === 'Résolu' || signalement.statut === 'Fermé') {
      items.push({
        status: 'En cours',
        date: formatDate(signalement.updated),
        label: 'Pris en charge',
        color: '#F59E0B',
      });
    }

    if (signalement.statut === 'Résolu' || signalement.statut === 'Fermé') {
      items.push({
        status: 'Résolu',
        date: formatDate(signalement.updated),
        label: 'Résolu',
        color: '#16A34A',
      });
    }

    return items;
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#1B2A6B' }}>
      <Helmet>
        <title>{`Signalement ${signalement.reference || `#${signalement.id.slice(0, 6)}`} - Toulon & Vous`}</title>
      </Helmet>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40" style={{ backgroundColor: '#0F1E5C' }}>
        <div className="max-w-[430px] mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white font-bold text-xl">
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
          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
        >
          <div className="mb-4">
            <StatusBadge status={signalement.statut || 'Nouveau'} />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-white/60 text-sm mb-1">Catégorie</p>
              <p className="text-white font-medium">{signalement.categorie}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Adresse</p>
              <p className="text-white">{signalement.adresse}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Date</p>
              <p className="text-white">{formatDate(signalement.created)}</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
        >
          <h2 className="text-white font-bold text-lg mb-3">Description</h2>
          <p className="text-white leading-relaxed">{signalement.description}</p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
        >
          <h2 className="text-white font-bold text-lg mb-4">Suivi</h2>
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