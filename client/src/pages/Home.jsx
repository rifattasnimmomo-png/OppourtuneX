import {useNavigate} from "react-router-dom";

function Home(){

    const navigate=useNavigate();

    const user=JSON.parse(localStorage.getItem("user"));

    const logout=()=>{

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login");

    };

    return(

        <div>

            <h1>OppourtuneX</h1>

            {

                user?

                (

                    <div>

                        <h2>Welcome {user.name}</h2>

                        <p>Email: {user.email}</p>

                        <p>Role: {user.role}</p>

                        <button onClick={logout}>
                            Logout
                        </button>

                    </div>

                )

                :

                (

                    <h2>No user logged in</h2>

                )

            }

        </div>

    );

}

export default Home;