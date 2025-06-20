import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { generateCaption, generateVibe } from '../geminiClient.js';

dotenv.config();

const captionCache = {};
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default function memesRoutes(io) {
  const router = express.Router();

  router.post('/submit', async (req, res) => {
    const { title, image, tags } = req.body;
    if (!title || !image || !tags) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());

    let caption = await generateCaption(tagArray);
    let vibe = await generateVibe(tagArray);

    if (!caption) caption = "Gemini cannot specify any caption";
    if (!vibe) vibe = "Always has a Cyberpunk vibe";

    const { data, error } = await supabase.from('memes').insert([
      { title, image, tags: tagArray.join(','), caption, vibe }
    ]).select();

    if (error) return res.status(500).json({ error: error.message });

    const meme = data[0];
    captionCache[meme.id] = { caption, vibe };

    res.status(201).json({ message: 'Meme submitted', data: meme });
  });

  router.get('/all', async (req, res) => {
    const { data, error } = await supabase.from('memes').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  router.post('/:id/caption', async (req, res) => {
    const { id } = req.params;
    const { tags = [] } = req.body;

    if (captionCache[id]) return res.json(captionCache[id]);

    let caption = await generateCaption(tags);
    let vibe = await generateVibe(tags);

    if (!caption) caption = "Gemini cannot specify any caption";
    if (!vibe) vibe = "Always has a Cyberpunk vibe";

    captionCache[id] = { caption, vibe };

    await supabase.from('memes').update({ caption, vibe }).eq('id', id);

    res.json({ caption, vibe });
  });

router.post('/:id/vote', async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  const increment = type === 'up' ? 1 : -1;

  const { error: rpcError } = await supabase
    .rpc('increment_vote', { meme_id: id, amount: increment });

  if (rpcError) return res.status(500).json({ error: rpcError.message });

  // Fetch updated vote count
  const { data, error } = await supabase
    .from('memes')
    .select('id, upvotes')
    .eq('id', id)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Emit updated vote count
  io.emit('vote-update', {
    memeId: id,
    upvotes: data.upvotes
  });

  res.json({ message: 'Vote updated successfully', data });
});

router.get('/leaderboard', async (req, res) => {
  const { top = 10 } = req.query;
  const { data, error } = await supabase
    .from('memes')
    .select('*')
    .order('upvotes', { ascending: false })
    .limit(parseInt(top));

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  });

  return router;
}