import fetch from 'node-fetch'
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Generate a funny meme caption based on tags
 * @param {string[]} tags
 * @returns {Promise<string|null>}
 */
export async function generateCaption(tags = []) {
  const prompt = `Generate a funny and short meme caption based on these tags: ${tags.join(", ")}. Keep it under 15 words.`
  return await callGemini(prompt)
}

/**
 * Generate a meme vibe description based on tags
 * @param {string[]} tags
 * @returns {Promise<string|null>}
 */
export async function generateVibe(tags = []) {
  const prompt = `Describe the aesthetic or vibe of a meme using these tags: ${tags.join(", ")}. 
  For example: 'Retro Vaporwave', 'Dark Academia', 'Wholesome Boomer Humor', etc.`
  return await callGemini(prompt)
}

/**
// Calls Gemini API with a given prompt
 * @param {string} prompt
 * @returns {Promise<string|null>}
 */
async function callGemini(prompt) {
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Gemini API error response:', data)
      return null
    }

    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null
  } catch (err) {
    console.error('Gemini error:', err)
    return null
  }
}
