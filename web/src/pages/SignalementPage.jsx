import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, MapPin, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import CategoryCard from '@/components/CategoryCard.jsx';
import BottomNav from '@/components/BottomNav.jsx';
import supabase from '@/lib/supabaseClient.js';
import { toast } from 'sonner';

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
  const fileInputRef = useRef(null);

  const categories = [
    { id: 'Voirie', icon: 'Construction', label: 'Voirie', color: '#EF4444' },
    { id: 'Éclairage', icon: 'Lightbulb', label: 'Éclairage', color: '#F59E0B' },
    { id: 'Espaces verts', icon: 'Trees', label: 'Espaces verts', color: '#16A34A' },
    { id: 'Propreté', icon: 'Trash2', label: 'Propreté', color: '#8B5CF6' },
    { id: 'Mobilier urbain', icon: 'Armchair', label: 'Mobilier urbain', color: '#F97316' },
    { id: 'Autre', icon: 'MoreHorizontal', label: 'Autre', color: '#6B7280' },
  ];

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Géolocalisation non disponible sur cet appareil');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`
          );
          const data = await res.json();
          const addr = data.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setAdresse(addr);
          toast.success('Position récupérée');
        } catch {
          // Fallback: raw coordinates
          setAdresse(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          toast.success('Position récupérée');
        }
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error('Accès à la position refusé — autorisez la localisation dans les paramètres');
        } else {
          toast.error('Impossible de récupérer votre position');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let photo_url = null;

      if (photo) {
        const ext = photo.name.split('.').pop();
        const fileName = `${currentUser.id}-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('signalement-photos')
          .upload(fileName, photo);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from('signalement-photos')
          .getPublicUrl(fileName);
        photo_url = urlData.publicUrl;
      }

      const { data, error } = await supabase.from('signalements').insert({
        user_id: currentUser.id,
        categorie: selectedCategory,
        description,
        adresse,
        statut: 'Nouveau',
        photo_url,
      }).select().single();

      if (error) throw error;

      setReference(data.reference || `#${data.id.slice(0, 8).toUpperCase()}`);
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
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#1B2A6B' }}>
        <Helmet><title>Signalement envoyé - Toulon & Vous</title></Helmet>
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
          <h1 className="text-white font-bold text-3xl mb-2">Signalement envoyé !</h1>
          <p className="text-white/70 text-lg mb-1">Référence : {reference}</p>
          <p className="text-white/60 text-sm mb-8">Vous recevrez un email de suivi</p>
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
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#1B2A6B' }}>
      <Helmet><title>Nouveau signalement - Toulon & Vous</title></Helmet>

      <div className="fixed top-0 left-0 right-0 z-40" style={{ backgroundColor: '#0F1E5C' }}>
        <div className="max-w-[430px] mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white font-bold text-xl">Nouveau signalement</h1>
        </div>
      </div>

      <div className="fixed top-16 left-0 right-0 z-40" style={{ backgroundColor: '#0F1E5C' }}>
        <div className="max-w-[430px] mx-auto px-4 py-3">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{ backgroundColor: s <= step ? '#2563EB' : 'rgba(255, 255, 255, 0.3)' }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[430px] mx-auto px-4 pt-28">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="text-white font-bold text-2xl mb-6">Quel type de problème ?</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {categories.map((cat) => (
                  <CategoryCard key={cat.id} icon={cat.icon} label={cat.label} color={cat.color} selected={selectedCategory === cat.id} onClick={() => setSelectedCategory(cat.id)} />
                ))}
              </div>
              <button onClick={() => setStep(2)} disabled={!selectedCategory} className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-200 hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: '#2563EB' }}>Suivant</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Photo (optionnel)</label>
                {/* input hidden — capture="environment" ouvre la caméra arrière sur mobile */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-2xl p-8 text-center transition-all duration-200 hover:bg-white/15"
                  style={{ background: 'rgba(255, 255, 255, 0.1)', border: '2px dashed rgba(255, 255, 255, 0.3)' }}
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                  ) : (
                    <>
                      <Camera className="text-white mx-auto mb-2" size={32} />
                      <p className="text-white/60 text-sm">Appuyez pour ajouter une photo</p>
                    </>
                  )}
                </button>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez le problème..." rows={4} className="w-full rounded-xl py-3 px-4 text-white placeholder:text-white/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }} />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Adresse</label>
                <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Adresse du problème" className="w-full rounded-xl py-3 px-4 text-white placeholder:text-white/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }} />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locating}
                  className="mt-2 text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300 transition-colors duration-200 disabled:opacity-50"
                >
                  {locating ? (
                    <><Loader2 size={16} className="animate-spin" />Localisation...</>
                  ) : (
                    <><MapPin size={16} />Ma position</>
                  )}
                </button>
              </div>
              <button onClick={() => setStep(3)} disabled={!description || !adresse} className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-200 hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: '#2563EB' }}>Suivant</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="text-white font-bold text-2xl mb-6">Vérifiez votre signalement</h2>
              <div className="rounded-2xl p-6 mb-6 space-y-4" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                <div><p className="text-white/60 text-sm mb-1">Catégorie</p><p className="text-white font-medium">{selectedCategory}</p></div>
                {photoPreview && (
                  <div><p className="text-white/60 text-sm mb-2">Photo</p><img src={photoPreview} alt="Preview" className="w-full h-32 object-cover rounded-xl" /></div>
                )}
                <div><p className="text-white/60 text-sm mb-1">Description</p><p className="text-white">{description}</p></div>
                <div><p className="text-white/60 text-sm mb-1">Adresse</p><p className="text-white">{adresse}</p></div>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-200 hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: '#2563EB' }}>
                {loading ? 'Envoi...' : 'Envoyer'}
              </button>
              <p className="text-white/60 text-sm text-center mt-4">Votre mairie sera notifiée immédiatement</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
};

export default SignalementPage;
