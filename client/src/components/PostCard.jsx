import { useState } from "react";
import "../styles/cards.css";
import { likePost, commentPost } from "../services/postService";
import { updatePost, deletePost } from "../services/postService";

function PostCard({ post, refresh }) {

    const user = JSON.parse(localStorage.getItem("user"));
    const isOwner = post.author === user.id;

    const [comment, setComment] = useState("");

    const handleLike = async () => {

        try {

            await likePost(post._id, user.id);

            refresh();

        }

        catch (err) {

            console.log(err);

        }

    };


    
    const handleComment = async () => {

        if (!comment.trim()) return;

        try {

            await commentPost(post._id, {

                userId: user.id,

                comment: comment

            });

            setComment("");

            refresh();

        }

        catch (err) {

            console.log(err);

        }

    };


    const handleDelete = async () => {

        try {

            await deletePost(post._id);

            refresh();

        }

        catch(err){

            console.log(err);

        }

    };

    const handleEdit = async () => {

        const newContent = prompt("Edit your post:", post.content);

        if(!newContent) return;

        try{

            await updatePost(post._id, {

                content: newContent

            });

            refresh();

        }

        catch(err){

            console.log(err);

        }

    };





    return (

        <div className="post-card">

            <h3>{post.authorName}</h3>

            <p>{post.content}</p>

            <p>❤️ {post.likes.length} Likes</p>

            <button onClick={handleLike}>

                Like

            </button>

            {
                isOwner && (

                    <div>

                        <button onClick={handleEdit}>

                            Edit

                        </button>

                        <button onClick={handleDelete}>

                            Delete

                        </button>

                    </div>

                )
            }


            <hr />

            <h4>Comments</h4>

            {

                post.comments.map((c) => (

                    <p key={c._id}>

                        <b>{c.name}</b>: {c.comment}

                    </p>

                ))

            }

            <textarea

                rows="2"

                placeholder="Write a comment..."

                value={comment}

                onChange={(e) => setComment(e.target.value)}

            />

            <br />

            <button onClick={handleComment}>

                Comment

            </button>

        </div>

    );

}

export default PostCard;