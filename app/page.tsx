"use client";

import { useState, useEffect } from "react";
import { Upload, Sparkles, Copy, Check, Image as ImageIcon, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tone, setTone] = useState("pro");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleGenerate = async () => {
    if (!imageFile) {
      setError("Veuillez uploader une image pour commencer.");
      return;
    }
    setError("");
    setResult("");
    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = async () => {
      try {
        const base64Image = reader.result;
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image, tone }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur serveur.");
        setResult(data.post);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            LinkedIn <span className="text-blue-600">Post Genius</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Générez des posts captivants en un clic.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          
          {/* Section Configuration */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="space-y-3">
              <label htmlFor="image-upload" className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                1. Votre Image
              </label>
              <div className={`relative group border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center min-h-[220px] 
                ${previewUrl ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-blue-400'}`}>
                
                {previewUrl ? (
                  <div className="relative w-full h-48">
                    <Image 
                      src={previewUrl} 
                      alt="Aperçu de l'upload" 
                      fill 
                      className="object-contain rounded-lg shadow-sm"
                    />
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <p className="mt-2 text-sm text-slate-500 text-center">Cliquez pour choisir un fichier</p>
                  </>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Choisir une image"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="tone-select" className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                2. Ton du contenu
              </label>
              <select
                id="tone-select"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
              >
                <option value="pro">💼 Professionnel & Expert</option>
                <option value="storytelling">📖 Storytelling & Inspirant</option>
                <option value="humour léger">🎉 Humour & Décontracté</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !imageFile}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Sparkles size={20} /> Générer le post</>}
            </button>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </section>

          {/* Section Résultat */}
          <section className={`flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all ${!result && 'opacity-60 bg-slate-50/50'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <ImageIcon size={18} className="text-blue-500" />
                Post généré
              </h3>
              
              {/* Icône de copie placée exactement comme sur la maquette */}
              <button
                onClick={handleCopy}
                disabled={!result}
                title="Copier le texte"
                className={`p-2 rounded-lg transition-all flex items-center gap-1 text-sm font-medium
                  ${result 
                    ? 'hover:bg-blue-50 text-slate-500 hover:text-blue-600' 
                    : 'text-slate-300 cursor-not-allowed'
                  }`}
              >
                {copied ? (
                  <>
                    <Check size={18} className="text-green-500" />
                    <span className="text-green-600">Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
            
            <textarea
              id="result-display"
              aria-label="Résultat de la génération du post"
              value={result}
              readOnly
              placeholder="Le texte apparaîtra ici après la génération..."
              className="w-full flex-1 min-h-[300px] bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-slate-700 resize-none leading-relaxed focus:outline-none"
            />
          </section>

        </div>
      </div>
    </main>
  );
}