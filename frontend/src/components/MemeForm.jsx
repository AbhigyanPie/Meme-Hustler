import {useState} from 'react'
import axios from 'axios'
import '../css/App.css'

const MemeForm = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [tags, setTags] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault()
        const tagArray = tags.split(',').map(tag => tag.trim())

        try{
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/memes/submit`,{
                title,
                image,
                tags: tagArray
            })
            alert('Meme submitted successfully!')
            setTitle('')
            setImage('')
            setTags('')
        }catch(err){
            alert('Error submitting meme')
            console.error(err)
        }
    }

    return(
        <form onSubmit={handleSubmit} className="form-container">
            <h2 className="form-heading">Submit Your Meme</h2>
  
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="form-input"
            />

            <input
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={e => setImage(e.target.value)}
                required
                className="form-input"
            />

            <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="form-input"
            />

            <button
                type="submit"
                className="form-button"
            >
            Submit Meme
            </button>
        </form>
    )
}

export default MemeForm