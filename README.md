# Générateur de Post LinkedIn à partir d’une image

Mini outil IA permettant de générer un post LinkedIn en français à partir d’une image.

L’application analyse l’image via l’API OpenAI (vision) puis génère un post structuré prêt à copier-coller.

---

## 🧠 Fonctionnalités

- Upload d’image (PNG / JPG)
- Choix du ton : professionnel, storytelling, humour léger
- Génération d’un post LinkedIn structuré
- Bouton copier
- Gestion basique des erreurs

---

## 🛠 Stack Technique

- Frontend : Next.js 16 (App Router)
- Backend : API Route Next.js
- IA : OpenAI (gpt-4o-mini vision)
- Styling : TailwindCSS
- Package manager : pnpm

---

## 📦 Installation

Cloner le repo :

```bash
git clone <repo-url>
cd mytest
```

Installer les dépendances :

```bash
pnpm install
```

Créer un fichier `.env.local` :

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
```

---

## ▶ Lancer le projet

```bash
pnpm dev
```

Puis ouvrir :

```
http://localhost:3000
```

---

## 🧩 Endpoint API

POST `/api/generate`

Body JSON :

```json
{
  "image": "data:image/png;base64,...",
  "tone": "pro"
}
```

Response :

```json
{
  "post": "..."
}
```

---

## 📌 Contraintes respectées

- Clé API via variable d’environnement
- Pas de base de données
- Code minimal et lisible
- Feature livrée end-to-end

---

## ✨ Exemple d’usage

- Image d’un robot → post sur l’IA
- Logo GitHub → post sur collaboration et développement
- Image d’un outil → post explicatif sur son utilité

---

## ⚠ Notes

Le projet nécessite un quota actif OpenAI pour fonctionner.




# AI Usage Documentation

## Outils utilisés

- ChatGPT 

---

## Comment l’IA a été utilisée

L’IA a été utilisée comme assistant technique pour :

- Amélioration du prompt pour forcer :
  - L’identification précise du sujet dans l’image
  - L’adaptation si logo / outil connu
  - Une structure LinkedIn stricte

- Suggestions d’amélioration UI (TailwindCSS)
- Optimisation de la gestion d’erreurs

---

## Ce que j’ai modifié moi-même

- Ajustement du prompt pour mieux répondre au sujet du test
- Correction des erreurs TypeScript
- Amélioration du ton et des règles de génération
- Adaptation du design pour un rendu plus professionnel
- Vérification de la conformité aux contraintes (variable d’environnement, structure, etc.)

---

## Logique principale implémentée

- Upload image côté front
- Conversion en base64
- Envoi vers API route
- Appel OpenAI avec vision
- Génération d’un post structuré
- Retour JSON propre
- Affichage et copie côté client.
