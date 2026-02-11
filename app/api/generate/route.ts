import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Tone = "pro" | "storytelling" | "humour";

export async function POST(req: Request) {
  try {
    const { image, tone } = await req.json() as {
      image: string;
      tone: Tone;
    };

    if (!image || !tone) {
      return NextResponse.json(
        { error: "Image et ton requis." },
        { status: 400 }
      );
    }

    const toneMap: Record<Tone, string> = {
      pro: "Adopte un ton professionnel, structuré et crédible.",
      storytelling: "Adopte un ton storytelling, inspirant et engageant.",
      humour: "Adopte un ton professionnel avec une légère touche d’humour.",
    };

    const prompt = `
Tu es un expert en personal branding LinkedIn.

MISSION :

1. Analyse précisément l’image fournie.
2. Identifie clairement le sujet principal visible.
3. Si c’est un logo ou un outil connu (ex: GitHub, Notion, OpenAI...), explique ce que c’est et son utilité.
4. Si c’est un objet, un robot, une personne ou un concept, explique son rôle et son importance.
5. Base entièrement le post sur le sujet réellement présent dans l’image (pas d’invention).

GÉNÈRE ENSUITE un post LinkedIn en français avec cette structure STRICTE :

- 1 accroche forte (1 seule ligne)
- 3 à 6 bullet points (commençant par "- ")
- 1 mini conclusion (1 à 2 lignes)
- 3 à 6 hashtags maximum

RÈGLES :

- Clair
- Impactant
- Pas trop long
- Emojis optionnels
- Aucun texte hors format demandé

TON :
${toneMap[tone]}

Le post doit être prêt à copier-coller sur LinkedIn.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const post = response.choices[0].message.content;

    return NextResponse.json({ post });

  } catch (error: any) {
    console.error("OpenAI Error:", error?.response?.data || error);

    return NextResponse.json(
      { error: "Erreur lors de la génération du post." },
      { status: 500 }
    );
  }
}
