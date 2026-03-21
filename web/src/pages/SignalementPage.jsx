import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, MapPin, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import CategoryCard from '@/components/CategoryCard.jsx';
import BottomNav from '@/components/BottomNav.jsx';
import supabase from '@/lib/supabaseClient';
import { toast } from 'sonner';
import APP_CONFIG from '@/config/app.js';

const SignalementPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [adresse, setAdresse] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reference, setReference] = useState('');

  const categories = [
    { id: 'Voirie', icon: 'Construction', label: 'Voirie', color: '#EF4444' },
    { id: 'Éclairage', icon: 'Lightbulb', label: 'Éclairage', color: '#F59E0B' },
    { id: 'Espaces verts', icon: 'Trees', label: 'Espaces verts', color: '#16A34A' },
    { id: 'Propreté', icon: 'Trash2', label: 'Propreté', color: '#8B5CF6' },
    { id: 'Mobilier urbain', icon: 'Armchair', label: 'Mobilier urbain', color: '#F97316' },
    { id: 'Autre', icon: 'MoreHorizontal', label: 'Autre', color: '#6B7280' },
  ];

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('La géolocalisation n\'est pas disponible sur cet appareil.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&accept-language=fr`
          );
          const data = await res.json();
          const addr = data.display_name || `${coords.latitude}, ${coords.longitude}`;
          setAdresse(addr);
          toast.success('Position récupérée');
        } catch {
          toast.error('Impossible de récupérer l\'adresse.');
        }
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error('Permission de localisation refusée. Activez-la dans les paramètres de votre navigateur.');
        } else {
          toast.error('Impossible de récupérer votre position.');
        }
      },
      { timeout: 10000 }
    );
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const refNumber = Math.floor(Math.random() * 900) + 100;
      const ref = `#2026-${refNumber}`;

      let photo_url = null;
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('signalement-photos')
          .upload(fileName, photo);
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('signalement-photos')
            .getPublicUrl(fileName);
          photo_url = publicUrl;
        }
      }

      const { error } = await supabase.from('signalements').insert({
        user_id: currentUser.id,
        categorie: selectedCategory,
        description,
        adresse,
        statut: 'Nouveau',
        reference: ref,
        photo_url,
      });
      if (error) throw error;

      setReference(ref);
      setSuccess(true);
      toast.success('Signalement envoyé');
    } catch (error) {
      console.error('Error creating signalement:', error);
      toast.error('Erreur lors de l\'envoi du signalement');
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#F5F7FF' }}>
        <Helmet>
          <title>Signalement envoyé - {APP_CONFIG.appName}</title>
        </Helmet>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: '#16A34A' }}
          >
            <Check className="text-white" size={32} />
          </motion.div>

          <h1 className="font-bold text-3xl mb-2" style={{ color: '#0D1B4A' }}>Signalement envoyé !</h1>
          <p className="text-lg mb-1" style={{ color: '#6B7280' }}>Référence : {reference}</p>
          <p className="text-sm mb-8" style={{ color: '#9CA3AF' }}>Vous recevrez un email de suivi</p>

          <button
            onClick={() => navigate('/accueil')}
            className="px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all duration-200 hover:brightness-110 active:scale-98"
            style={{ backgroundColor: '#2563EB' }}
          >
            Retour à l'accueil
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F5F7FF' }}>
      <Helmet>
        <title>Nouveau signalement - {APP_CONFIG.appName}</title>
      </Helmet>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-[430px] mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} style={{ color: '#0D1B4A' }}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-xl" style={{ color: '#0D1B4A' }}>Nouveau signalement</h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-[430px] mx-auto px-4 py-3">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: s <= step ? '#E8192C' : '#D1D5DB',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[430px] mx-auto px-4 pt-28">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-bold text-2xl mb-6" style={{ color: '#0D1B4A' }}>Quel type de problème ?</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    icon={cat.icon}
                    label={cat.label}
                    color={cat.color}
                    selected={selectedCategory === cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                  />
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedCategory}
                className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-200 hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#2563EB' }}
              >
                Suivant
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label className="block font-medium mb-2" style={{ color: '#0D1B4A' }}>Photo (optionnel)</label>
                <label
                  className="block rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 hover:bg-blue-50"
                  style={{
                    background: '#F5F7FF',
                    border: '2px dashed #D1D5DB',
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                  ) : (
                    <>
                      <Camera className="mx-auto mb-2" style={{ color: '#6B7280' }} size={32} />
                      <p className="text-sm" style={{ color: '#6B7280' }}>Appuyez pour ajouter une photo</p>
                    </>
                  )}
                </label>
              </div>

              <div>
                <label className="block font-medium mb-2" style={{ color: '#0D1B4A' }}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez le problème..."
                  rows={4}
                  className="w-full rounded-xl py-3 px-4 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    color: '#0D1B4A',
                  }}
                />
              </div>

              <div>
                <label className="block font-medium mb-2" style={{ color: '#0D1B4A' }}>Adresse</label>
                <input
                  type="text"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  placeholder="Adresse du problème"
                  className="w-full rounded-xl py-3 px-4 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    color: '#0D1B4A',
                  }}
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locating}
                  className="mt-2 text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300 transition-colors duration-200 disabled:opacity-50"
                >
                  <MapPin size={16} />
                  {locating ? 'Localisation...' : 'Ma position'}
                </button>
              </div>

              <button
                onClick={() => setStep(3)}
                disabled={!description || !adresse}
                className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-200 hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#2563EB' }}
              >
                Suivant
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-bold text-2xl mb-6" style={{ color: '#0D1B4A' }}>Vérifiez votre signalement</h2>
              <div
                className="rounded-2xl p-6 mb-6 space-y-4"
                style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                <div>
                  <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Catégorie</p>
                  <p className="font-medium" style={{ color: '#0D1B4A' }}>{selectedCategory}</p>
                </div>
                {photoPreview && (
                  <div>
                    <p className="text-sm mb-2" style={{ color: '#6B7280' }}>Photo</p>
                    <img src={photoPreview} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                  </div>
                )}
                <div>
                  <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Description</p>
                  <p style={{ color: '#0D1B4A' }}>{description}</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Adresse</p>
                  <p style={{ color: '#0D1B4A' }}>{adresse}</p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-200 hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#E8192C' }}
              >
                {loading ? 'Envoi...' : 'Envoyer le signalement'}
              </button>

              <p className="text-sm text-center mt-4" style={{ color: '#6B7280' }}>
                Votre mairie sera notifiée immédiatement
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
};

export default SignalementPage;