import { useEffect, useState } from "react";
import { getPosts, createPost } from "../services/postService";
import PostCard from "../components/PostCard";

function Feed() {

    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {

        try {

            const res = await getPosts();

            setPosts(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const handlePost = async () => {
        
        console.log("Button clicked");

        if (!content.trim()) {
            console.log("Content is empty");
            return;
        }

        console.log("Content:", content);

        try {

            console.log("Sending request...");
            
            
            
            const res = await createPost({

                author: user.id,

                content: content

            });

            console.log(res.data);

            setContent("");

            loadPosts();

        }

        catch (err) {

            console.log(err);

        }

    };
    return (

        <div>

            <div className="post-card">

                <textarea

                    rows="4"

                    placeholder="Share something with the community..."

                    value={content}

                    onChange={(e) => setContent(e.target.value)}

                />

                <br /><br />

                <button onClick={handlePost}>

                    Create Post

                </button>

            </div>

            <h1>Community Feed</h1>

            {

                posts.map((post) => (

                    <PostCard

                        key={post._id}

                        post={post}
                        refresh={loadPosts}

                    />

                ))

            }

        </div>

    );

}

export default Feed;