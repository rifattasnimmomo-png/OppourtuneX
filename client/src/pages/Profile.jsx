import { useEffect, useState } from "react";

import { getProfile, updateProfile } from "../services/userService";

import PostCard from "../components/PostCard";

import { getPosts } from "../services/postService";

function Profile() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [profile, setProfile] = useState(null);

    const [posts, setPosts] = useState([]);

    const [editing, setEditing] = useState(false);

    useEffect(() => {

        loadProfile();

        loadPosts();

    }, []);

    const loadProfile = async () => {

        try {

            const res = await getProfile(user.id);

            setProfile(res.data);

        }

        catch(err){

            console.log(err);

        }

    };

    const loadPosts = async () => {

        try{

            const res = await getPosts();

            const myPosts = res.data.filter(

                post => post.author?.toString() === user.id

            );

            setPosts(myPosts);

        }

        catch(err){

            console.log(err);

        }

    };



    const handleSave = async () => {

        try {

            await updateProfile(user.id, {

                name: profile.name,

                department: profile.department,

                phone: profile.phone,

                cgpa: profile.cgpa,

                bio: profile.bio

            });

            setEditing(false);

            loadProfile();

        }

        catch (err) {

            console.log(err);

        }

    };

    if(!profile){

        return <h2>Loading...</h2>;

    }
    
    console.log(profile);
    console.log(posts);
    return(

        <div>

            <h1>My Profile</h1>

            <hr />

            <p>

                <b>Name:</b>

                <input

                    value={profile.name}

                    disabled={!editing}

                    onChange={(e)=>

                        setProfile({

                            ...profile,

                            name:e.target.value

                        })

                    }

                />

            </p>

            <p><b>Email:</b> {profile.email}</p>

            <p><b>Role:</b> {profile.role}</p>

            <p>

                <b>Department:</b>

                <input

                    value={profile.department}

                    disabled={!editing}

                    onChange={(e)=>

                        setProfile({

                            ...profile,

                            department:e.target.value

                        })

                    }

                />

            </p>

            <p>

                <b>Phone:</b>

                <input

                    value={profile.phone}

                    disabled={!editing}

                    onChange={(e)=>

                        setProfile({

                            ...profile,

                            phone:e.target.value

                        })

                    }

                />

            </p>

            <p>

                <b>CGPA:</b>

                <input

                    type="number"

                    step="0.01"

                    value={profile.cgpa}

                    disabled={!editing}

                    onChange={(e)=>

                        setProfile({

                            ...profile,

                            cgpa:e.target.value

                        })

                    }

                />

            </p>

            <p>

                <b>Bio:</b>

                <textarea

                    rows="3"

                    value={profile.bio}

                    disabled={!editing}

                    onChange={(e)=>

                        setProfile({

                            ...profile,

                            bio:e.target.value

                        })

                    }

                />

            </p>

            {

                editing ?

                (

                    <button onClick={handleSave}>

                        Save Profile

                    </button>

                )

                :

                (

                    <button onClick={()=>setEditing(true)}>

                        Edit Profile

                    </button>

                )

            }

            <br /><br />





            <hr />

            <h2>My Posts</h2>

            {

                posts.map(post=>(

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

export default Profile;